// src/routes/dashboard/blogs/+page.server.ts
import { query } from '$lib/utils/db';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const offset = (page - 1) * PAGE_SIZE;

  const res = await query(`
    SELECT id, title, slug, published, created_at
    FROM blogs
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `, [PAGE_SIZE, offset]);

  const countRes = await query(`SELECT COUNT(*) FROM blogs`);
  const total = parseInt(countRes.rows[0].count);

  return {
    blogs: res.rows,
    page,
    total,
    pageSize: PAGE_SIZE
  };
};
