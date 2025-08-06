import { error } from '@sveltejs/kit';
import { query } from '$lib/utils/db';

export async function load({ params }) {
  const { slug } = params;

  // Charger l'article
  const postRes = await query(
    `SELECT * FROM blogs WHERE slug = $1 AND published = true`,
    [slug]
  );
  const blog = postRes.rows[0];
  if (!blog) throw error(404, 'Blog not found');

  // Charger les catégories liées
  const categoriesRes = await query(
    `SELECT c.name, c.slug
     FROM categories c
     JOIN blog_categories bc ON bc.category_id = c.id
     WHERE bc.blog_id = $1`,
    [blog.id]
  );

  // Charger les tags liés
  const tagsRes = await query(
    `SELECT t.name, t.slug
     FROM tags t
     JOIN blog_tags bt ON bt.tag_id = t.id
     WHERE bt.blog_id = $1`,
    [blog.id]
  );

  return {
    blog,
    categories: categoriesRes.rows,
    tags: tagsRes.rows
  };
}
