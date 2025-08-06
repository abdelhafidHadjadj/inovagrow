import { query } from '$lib/utils/db';
import { timeAgo } from '$lib/utils/time';   // si tu veux un “il y a …”
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // 3 derniers blogs publiés
  const res = await query(`
    SELECT b.title, b.slug, b.cover_image_url, b.description,
           b.created_at, c.name AS category
    FROM blogs b
    LEFT JOIN blog_categories bc ON bc.blog_id = b.id
    LEFT JOIN categories c      ON c.id  = bc.category_id
    WHERE b.published = true
    ORDER BY b.created_at DESC
    LIMIT 3
  `);

  const posts = res.rows.map((row) => ({
    title: row.title,
    excerpt: row.description,
    slug: row.slug,
    image: row.cover_image_url || '/placeholder.png',
    category: row.category || 'Uncategorized',
    time: timeAgo(new Date(row.created_at), 'fr')   // ou 'en'
  }));

  return { posts };
};
