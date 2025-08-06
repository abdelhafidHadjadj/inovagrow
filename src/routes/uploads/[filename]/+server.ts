// src/routes/uploads/[filename]/+server.ts
import fs from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
  const file = params.filename;
  const filePath = path.resolve('src/uploads', file);

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(file).slice(1);
    const type = ext === 'png' ? 'image/png'
              : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
              : 'application/octet-stream';

    return new Response(data, {
      headers: {
        'Content-Type': type
      }
    });
  } catch {
    throw error(404, 'Not found');
  }
}
