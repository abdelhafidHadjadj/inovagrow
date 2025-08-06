import type { RequestHandler } from '@sveltejs/kit';
import { query } from '$lib/utils/db';
import { slugify } from '$lib/utils/slugify';
import { json } from '@sveltejs/kit';
import { timeAgo } from '$lib/utils/time';

const PAGE_SIZE = 6;

export const POST: RequestHandler = async ({ request, locals }) => {
  const {
    title, description, content_html,
    cover_image_url, meta_title, meta_description, published,
    categories = [],
    tags = []
  } = await request.json();

  if (!title || !content_html) {
    return json({ error: 'Title & content required' }, { status: 400 });
  }

  const slug = slugify(title);

  try {
    // 1. Insert blog
    const insertRes = await query(`
      INSERT INTO blogs
      (title, slug, description, content_html, cover_image_url,
       meta_title, meta_description, author_id, published, published_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $9 THEN NOW() END)
      RETURNING id`,
      [title, slug, description, content_html, cover_image_url,
       meta_title, meta_description, locals.user?.id ?? null, published ?? false]
    );

    const blogId = insertRes.rows[0].id;

    // 2. Link categories
    for (const categoryId of categories) {
      await query(
        `INSERT INTO blog_categories (blog_id, category_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [blogId, categoryId]
      );
    }

    // 3. Handle tags
    for (const tagName of tags) {
      const slug = slugify(tagName);
      const tagRes = await query(
        `INSERT INTO tags (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [tagName, slug]
      );

      const tagId = tagRes.rows[0].id;

      await query(
        `INSERT INTO blog_tags (blog_id, tag_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [blogId, tagId]
      );
    }

    return json({ success: true, slug }, { status: 201 });

  } catch (err) {
    if ((err as any).code === '23505') {
      return json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error(err);
    return json({ error: 'DB error' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const offset = (page - 1) * PAGE_SIZE;

  const res = await query(`
    SELECT b.id, b.title, b.slug, b.cover_image_url, b.description, b.created_at, 
           c.name AS category
    FROM blogs b
    LEFT JOIN blog_categories bc ON bc.blog_id = b.id
    LEFT JOIN categories c ON c.id = bc.category_id
    WHERE b.published = true
    ORDER BY b.created_at DESC
    LIMIT $1 OFFSET $2
  `, [PAGE_SIZE, offset]);

  const blogs = res.rows.map((row) => ({
    title: row.title,
    excerpt: row.description,
    slug: row.slug,
    image: row.cover_image_url || '/placeholder.png',
    category: row.category || 'Uncategorized',
    time: timeAgo(new Date(row.created_at), 'fr')
  }));

  return json({ blogs });
};
