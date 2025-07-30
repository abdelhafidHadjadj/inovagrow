import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
  const { token, password } = await request.json();

  if (!token || !password) return json({ error: 'Invalid request' }, { status: 400 });

  const res = await query(`
    WITH deleted AS (
      DELETE FROM password_resets
      WHERE token = $1 AND expires_at > NOW()
      RETURNING user_id
    )
    UPDATE users
    SET password_hash = $2
    WHERE id IN (SELECT user_id FROM deleted)
    RETURNING id
  `, [token, await bcrypt.hash(password, 12)]);

  if (!res.rowCount) {
    return json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  return json({ success: true });
}
