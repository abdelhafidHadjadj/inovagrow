import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';
import { sendVerificationEmail } from '$lib/utils/email.js';
import { v4 as uuidv4 } from 'uuid';

/** helper */
function bad(code, message, status = 400) {
  return json({ success: false, code, message }, { status });
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
  const { email } = await event.request.json() ?? {};
  const cleanEmail = String(email || '').trim().toLowerCase();

  /* basic validation */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(cleanEmail)) {
    return bad('INVALID_EMAIL', 'Invalid e-mail format.');
  }

  /* look up user */
  const userRes = await query(
    `SELECT id, name, email_verified FROM users WHERE email = $1`,
    [cleanEmail]
  );

  if (userRes.rowCount === 0) {
    return bad('NOT_FOUND', 'No account found for this e-mail.', 404);
  }

  const user = userRes.rows[0];
  if (user.email_verified) {
    return bad('ALREADY_VERIFIED', 'This e-mail is already verified.');
  }

  /* create new token */
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h
  await query(
    `INSERT INTO email_verifications (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, token, expiresAt]
  );

  /* locale from hooks (fallback 'en') */
  const lang = event.locals.lang || 'en';
  await sendVerificationEmail(cleanEmail, user.name, token, lang);

  return json({
    success: true,
    message: 'A new verification e-mail has been sent.'
  });
}
