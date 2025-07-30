// src/routes/api/auth/register/+server.js
import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '$lib/utils/email.js';

/* ------------------------- reusable helper ---------------------------- */
function badRequest(code, message, details = {}) {
  return json({ success: false, code, message, details }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
  const { request, locals } = event;           // ⬅️ grab locals.lang
  const lang = locals.lang || 'en';            // "en" / "fr" / default

  /* ------------------------------ INPUT ------------------------------- */
  const { email, password, name } = await request.json();
  const cleanEmail    = String(email || '').trim().toLowerCase();
  const cleanName     = String(name  || '').trim();
  const cleanPassword = String(password || '');

  /* ---------------------------- VALIDATION --------------------------- */
  if (!cleanEmail || !cleanPassword || !cleanName) {
    return badRequest('VALIDATION_ERROR', 'All fields are required.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(cleanEmail)) {
    return badRequest('VALIDATION_ERROR', 'Invalid e-mail format.', {
      field: 'email'
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,100}$/;
  if (!passwordRegex.test(cleanPassword)) {
    return badRequest(
      'PASSWORD_WEAK',
      'Password must be 6–100 characters and include uppercase, lowercase, digit and special character.'
    );
  }

  /* -------------------------- CREATE USER --------------------------- */
  const passwordHash      = await bcrypt.hash(cleanPassword, 12);
  const verificationToken = uuidv4();
  const expiresAt         = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  try {
    const { rows } = await query(
      `
      WITH new_user AS (
        INSERT INTO users (email, password_hash, name)
        VALUES ($1, $2, $3)
        RETURNING id
      )
      INSERT INTO email_verifications (user_id, token, expires_at)
      SELECT id, $4, $5 FROM new_user
      RETURNING (SELECT id FROM new_user) AS user_id;
      `,
      [cleanEmail, passwordHash, cleanName, verificationToken, expiresAt]
    );
    const userId = rows[0].user_id;

    /* -------------------- SEND VERIFICATION E-MAIL ------------------- */
    try {
      await sendVerificationEmail(
        cleanEmail,
        cleanName,
        verificationToken,
        lang               // 👈 locale prefix in the link
      );
    } catch (mailErr) {
      console.error('SMTP error:', mailErr);
      return json(
        {
          success: false,
          code: 'MAIL_SENDING_FAILED',
          message:
            'Account created, but we could not send the verification e-mail. Please try again later.',
          userId,
          emailSent: false
        },
        { status: 502 }
      );
    }

    /* ----------------------------- OK ------------------------------- */
    return json({
      success: true,
      message:
        'Registration successful. A verification e-mail has been sent.',
      userId,
      emailSent: true
    });
  } catch (err) {
    console.error('Register error:', err);

    if (err.code === '23505') {
      return badRequest(
        'EMAIL_IN_USE',
        'This e-mail address is already registered.',
        { field: 'email' }
      );
    }

    return json(
      {
        success: false,
        code: 'UNEXPECTED_ERROR',
        message: 'Unexpected server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}
