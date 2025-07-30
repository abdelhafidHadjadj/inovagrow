import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';

export async function POST({ cookies }) {
  const sessionId = cookies.get('sessionId');
  if (sessionId) {
    await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    cookies.delete('sessionId', { path: '/' });
  }
  return json({ success: true });
}
