// src/routes/api/auth/verify-email/+server.js
import { redirect } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function GET(event) {
  const { url, cookies } = event;
  const token = url.searchParams.get('token');
  const lang  = url.searchParams.get('lang') || '';
  const prefix = lang ? `/${lang}` : '';

  if (!token) throw redirect(302, `${prefix}/verify-email/invalid`);

  const verifyRes = await query(
    `
    WITH deleted AS (
      DELETE FROM email_verifications
      WHERE token = $1 AND expires_at > NOW()
      RETURNING user_id
    )
    UPDATE users
    SET email_verified = TRUE
    WHERE id IN (SELECT user_id FROM deleted)
    RETURNING id, role;
    `,
    [token]
  );

  if (verifyRes.rowCount === 0) {
    throw redirect(302, `${prefix}/verify-email/invalid`);
  }

  const { id: userId, role } = verifyRes.rows[0];

  const sessionId = uuidv4();
  const expires   = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)`,
    [sessionId, userId, expires]
  );

  cookies.set('sessionId', sessionId, {
    httpOnly : true,
    sameSite : 'lax',
    secure   : process.env.NODE_ENV === 'production',
    path     : '/',
    expires
  });

  // ✅ redirect to success (with lang)
  throw redirect(302, `${prefix}/verify-email/success`);
}
