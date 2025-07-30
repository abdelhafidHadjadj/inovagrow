import { json } from '@sveltejs/kit';
import { pool } from '$lib/utils/db.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, locals }) {
  const user = locals.user;

  if (!user || user.role !== 'admin') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }

  const {
    title,
    body_html,
    images,
    meta_title,
    meta_description,
    description_html,
    categories,
    tags
  } = await request.json();

  if (!title || !body_html) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 100);
    const result = await client.query(
      `INSERT INTO blogs (title, slug, content_html, meta_title, meta_description, description_html, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [title, slug, body_html, meta_title, meta_description, description_html, user.id]
    );

    const blogId = result.rows[0].id;

    if (Array.isArray(categories)) {
      for (const catId of categories) {
        await client.query(
          `INSERT INTO blog_categories (blog_id, category_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [blogId, catId]
        );
      }
    }

    if (Array.isArray(tags)) {
      for (const tagId of tags) {
        await client.query(
          `INSERT INTO blog_tags (blog_id, tag_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [blogId, tagId]
        );
      }
    }

    await client.query('COMMIT');

    return json({ success: true, blogId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur ajout blog:', err);
    return json({ error: 'Erreur serveur' }, { status: 500 });
  } finally {
    client.release();
  }
}
