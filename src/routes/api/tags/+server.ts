import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db';
import { slugify } from '$lib/utils/slugify';

export const GET: RequestHandler = async () => {
  const res = await query('SELECT id, name, slug FROM tags ORDER BY name');
  return json(res.rows);
};

export const POST: RequestHandler = async ({ request }) => {
  const { name } = await request.json();
  if (!name) return json({ error: 'Name is required' }, { status: 400 });

  const slug = slugify(name);
  try {
    const res = await query(
      'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    return json(res.rows[0], { status: 201 });
  } catch (err) {
    return json({ error: 'Tag already exists or DB error' }, { status: 400 });
  }
};
