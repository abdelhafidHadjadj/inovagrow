// src/routes/api/users/[id]/+server.ts
import { query } from '$lib/utils/db';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ params }) => {
  try {
    await query(`DELETE FROM users WHERE id = $1`, [params.id]);
    return json({ success: true });
  } catch (e) {
    return json({ error: 'DB error' }, { status: 500 });
  }
};
