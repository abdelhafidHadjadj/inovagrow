import { redirect } from '@sveltejs/kit';
import { query } from '$lib/utils/db';

const supportedLanguages = ['en', 'fr'];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const pathname     = event.url.pathname;
  const langFromPath = pathname.split('/')[1];

  /* 1 ▸ Determine language (path → cookie → default) */
  let lang;
  if (supportedLanguages.includes(langFromPath)) {
    lang = langFromPath;
  } else {
    const cookieLang = event.cookies.get('lang');
    lang = supportedLanguages.includes(cookieLang) ? cookieLang : 'en';
  }
  event.locals.lang = lang;           // available to all endpoints
  const prefix = `/${lang}`;          // "/en" or "/fr"

  /* 2 ▸ For *public* pages (not /api, /dashboard, /login) enforce prefix */
  const isPublicPage =
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/login');

  if (isPublicPage && !pathname.startsWith(prefix)) {
    throw redirect(307, `${prefix}${pathname}`);
  }

  /* 3 ▸ Session lookup (same as before) */
  const sessionId = event.cookies.get('sessionId');
  if (sessionId) {
    try {
      const res = await query(
        `SELECT users.id, users.email, users.name, users.role
         FROM sessions
         JOIN users ON users.id = sessions.user_id
         WHERE sessions.id = $1 AND sessions.expires_at > NOW()`,
        [sessionId]
      );
      if (res.rowCount) event.locals.user = res.rows[0];
    } catch (err) {
      console.error('Session lookup error:', err);
    }
  }

  /* 4 ▸ Global dashboard guard */
  if (pathname.startsWith('/dashboard') && !event.locals.user) {
    throw redirect(303, `${prefix}/login`);
  }

  /* 5 ▸ Role-specific guards */
  if (pathname.startsWith('/dashboard/admin') &&
      event.locals.user?.role !== 'admin') {
    throw redirect(303, `${prefix}/login`);
  }

  if (pathname.startsWith(`/${lang}/dashboard`) &&
      event.locals.user?.role !== 'user') {
    throw redirect(303, `${prefix}/login`);
  }

  return resolve(event);
}
