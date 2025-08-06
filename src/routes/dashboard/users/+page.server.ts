import { query } from '$lib/utils/db';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url }) => {
  const page   = parseInt(url.searchParams.get('page') || '1');
  const offset = (page - 1) * PAGE_SIZE;

  // Récupère les utilisateurs (adapte les colonnes à ton schéma)
  const usersRes  = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [PAGE_SIZE, offset]
  );

  const countRes  = await query(`SELECT COUNT(*) FROM users`);
  const total     = parseInt(countRes.rows[0].count);

  return {
    users: usersRes.rows,
    page,
    pageSize: PAGE_SIZE,
    total
  };
};
