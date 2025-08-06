// src/routes/api/upload/image/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/private';

export const config = { csrf: false };

const UPLOAD_DIR = path.resolve('src', 'uploads');

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();
  const blob = form.get('image');

  if (!(blob && blob instanceof Blob))
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });

  const ext       = (blob.type.split('/')[1] || 'png').replace(/[^a-z0-9]/gi, '');
  const filename  = `${randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await blob.arrayBuffer()));

  /* ▶ URL ABSOLUE (http://localhost:3000/uploads/uuid.png) */
  const base =
    (env.BASE_URL && env.BASE_URL.replace(/\/$/, ''))      // .env → conteneur
      || new URL(request.url).origin;                      // secour

  const url = `/uploads/${filename}`;

  return new Response(JSON.stringify({ url }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
