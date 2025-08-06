import { query } from '$lib/utils/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const blogRes = await query(`SELECT * FROM blogs WHERE id = $1`, [params.id]);
  const blog = blogRes.rows[0];
  if (!blog) throw error(404, 'Blog not found');

  const catRes = await query(`SELECT id, name FROM categories ORDER BY name`);
  const allCategories = catRes.rows;

  const blogCatRes = await query(
    `SELECT category_id FROM blog_categories WHERE blog_id = $1`,
    [params.id]
  );
  const selectedCategories = blogCatRes.rows.map((r) => r.category_id);

  const tagRes = await query(
    `SELECT t.id, t.name
     FROM tags t
     JOIN blog_tags bt ON bt.tag_id = t.id
     WHERE bt.blog_id = $1`,
    [params.id]
  );
  const selectedTags = tagRes.rows.map((t) => t.name);

  return { blog, allCategories, selectedCategories, selectedTags };
};
