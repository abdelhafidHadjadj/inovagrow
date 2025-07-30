// src/routes/api/upload/+server.js
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export async function POST({ request }) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file || !file.name) {
    return json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = 'static/uploads';
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filepath, buffer);

  return json({ url: `/uploads/${filename}` });
}
