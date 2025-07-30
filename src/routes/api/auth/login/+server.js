import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';



/* tiny helper */
function bad(message) {
  return json({ success: false, message }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
  const { email, password } = await event.request.json() ?? {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass  = String(password || '');

  if (!cleanEmail || !cleanPass) {
    return bad('Both e-mail and password are required.');
  }

  /* 1 ─ fetch user (must be verified & active) */
  const res = await query(
    `SELECT id, password_hash, name, role, email_verified, is_active
     FROM users
     WHERE email = $1`,
    [cleanEmail]
  );

  if (res.rowCount === 0) {
    return bad('Invalid credentials.');
  }

  const user = res.rows[0];

  if (!user.email_verified) {
    return bad('Please verify your e-mail before logging in.');
  }
  if (!user.is_active) {
    return bad('Account disabled. Contact support.');
  }

  /* 2 ─ compare passwords */
  const match = await bcrypt.compare(cleanPass, user.password_hash);
  if (!match) {
    return bad('Invalid credentials.');
  }

  /* 3 ─ create session */
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day session

  await query(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sessionId, user.id, expiresAt]
  );

  /* 4 ─ set secure HTTP-only cookie */
  const cookieOpts = {
    httpOnly : true,
    sameSite : 'lax',
    secure   : process.env.NODE_ENV === 'production',
    path     : '/',
    expires  : expiresAt
  };
  event.cookies.set('sessionId', sessionId, cookieOpts);

  /* 5 ─ respond */
  return json({
    success: true,
    message: 'Login successful.',
    user   : { id: user.id, name: user.name, role: user.role }
  });
}
