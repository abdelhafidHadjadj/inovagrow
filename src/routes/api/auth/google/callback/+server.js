import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { query } from '$lib/utils/db.js';
import { v4 as uuidv4 } from 'uuid';
import { locale } from '$lib/stores/locale';
import { get } from 'svelte/store';

const lang = get(locale);

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/auth/google/callback`
);

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  if (!code) throw redirect(302, `/${lang}/login`);

  // 1 ─ obtenir tokens + profil
  const { tokens } = await client.getToken(code);
  await client.setCredentials(tokens);

  const { data: profile } = await client.request({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo'
  });

  const { id: googleId, email, name } = profile;

  // 2 ─ créer / retrouver l’utilisateur
  const existing = await query(`
    SELECT users.id, users.role
    FROM oauth_accounts
    JOIN users ON users.id = oauth_accounts.user_id
    WHERE provider = 'google' AND provider_id = $1
  `, [googleId]);

  let userId, role;
  if (existing.rowCount) {
    ({ id: userId, role } = existing.rows[0]);
  } else {
    // nouvel utilisateur : créer users + oauth_accounts
    const res = await query(`
      WITH new_user AS (
        INSERT INTO users (email, name, email_verified)
        VALUES ($1, $2, TRUE)
        RETURNING id, role
      )
      INSERT INTO oauth_accounts (user_id, provider, provider_id, email, name)
      SELECT id, 'google', $3, $1, $2 FROM new_user
      RETURNING user_id, (SELECT role FROM new_user)
    `, [email, name, googleId]);

    userId = res.rows[0].user_id;
    role   = res.rows[0].role;
  }

  // 3 ─ créer session + cookie
  const sessionId = uuidv4();
  const expires   = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await query(`INSERT INTO sessions (id, user_id, expires_at) VALUES ($1,$2,$3)`,
              [sessionId, userId, expires]);

  cookies.set('sessionId', sessionId, {
    httpOnly : true,
    sameSite : 'lax',
    secure   : process.env.NODE_ENV === 'production',
    path     : '/',
    expires
  });

  // 4 ─ redirection dashboard user
  throw redirect(302, `/${lang}/dashboard`);
}
