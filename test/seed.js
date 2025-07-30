import "dotenv/config";
import bcrypt from 'bcrypt';
import { query } from '../src/lib/utils/db.js'; // adapte le chemin si nécessaire
import { v4 as uuidv4 } from 'uuid';

const name = 'Admin';
const email = 'admin@inova.com';
const password = 'admin123';
const role = 'admin';

const hash = await bcrypt.hash(password, 10);
const userId = uuidv4();

await query(
  `INSERT INTO users (id, name, email, password_hash, role)
   VALUES ($1, $2, $3, $4, $5)`,
  [userId, name, email, hash, role]
);

console.log('✅ Admin user created:', email);
process.exit();
