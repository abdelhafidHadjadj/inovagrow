import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db';
import { slugify } from '$lib/utils/slugify';

export const PUT: RequestHandler = async ({ params, request }) => {
  const { name } = await request.json();
  if (!name) return json({ error: 'Name is required' }, { status: 400 });

  const slug = slugify(name);
  try {
    const res = await query(
      `UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *`,
      [name, slug, params.id]
    );
    return json(res.rows[0]);
  } catch (err) {
    return json({ error: 'Update failed' }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const usedRes = await query(
    `SELECT COUNT(*) FROM blog_categories WHERE category_id = $1`,
    [params.id]
  );
  if (parseInt(usedRes.rows[0].count) > 0) {
    return json({ error: 'Cannot delete: category is used in blog posts' }, { status: 400 });
  }

  await query(`DELETE FROM categories WHERE id = $1`, [params.id]);
  return json({ success: true });
};
