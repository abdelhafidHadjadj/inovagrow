import type { RequestHandler } from '@sveltejs/kit';
import { query } from '$lib/utils/db';
import { slugify } from '$lib/utils/slugify';
import { json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params }) => {
  const {
    title, description, content_html,
    cover_image_url, meta_title, meta_description, published
  } = await request.json();

  const slug = slugify(title);

  try {
    await query(
      `UPDATE blogs SET
        title = $1,
        slug = $2,
        description = $3,
        content_html = $4,
        cover_image_url = $5,
        meta_title = $6,
        meta_description = $7,
        published = $8,
        published_at = CASE WHEN $8 THEN NOW() ELSE NULL END
      WHERE id = $9`,
      [
        title, slug, description,
        content_html, cover_image_url,
        meta_title, meta_description,
        published,
        params.id
      ]
    );
    return json({ success: true });
  } catch (err) {
    return json({ error: 'Update failed' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  await query(`DELETE FROM blogs WHERE id = $1`, [params.id]);
  return json({ success: true });
};
