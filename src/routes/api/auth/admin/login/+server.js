import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { query } from '$lib/utils/db';

export async function POST({ request, cookies }) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const userRes = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    const user = userRes.rows[0];
    if (!user || user.role !== 'admin') {
      return json({ error: 'Access denied' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await query(
      `INSERT INTO sessions (id, user_id, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, user.id, expiresAt, request.headers.get('user-agent'), request.headers.get('x-forwarded-for')]
    );

    cookies.set('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24
    });

    return json({ success: true });
  } catch (err) {
    console.error('Admin login error:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
