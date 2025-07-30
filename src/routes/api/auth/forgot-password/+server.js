import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db.js';
import crypto from 'crypto';
import { sendEmail } from '$lib/utils/email.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // fallback local

export async function POST({ request }) {
  const { email, lang = 'en' } = await request.json();

  // Vérifie si l'utilisateur existe
  const res = await query(`SELECT id, name FROM users WHERE email = $1`, [email]);
  if (res.rows.length === 0) {
    // ✅ Répond toujours avec succès pour éviter la fuite d'info
    return json({ success: true });
  }

  const user = res.rows[0];

  // Génère un token unique et une date d'expiration
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  // Insère le token dans la table de reset
  await query(`
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES ($1, $2, $3)
  `, [user.id, token, expires]);

  // Construit le lien de réinitialisation
  const resetLink = `${BASE_URL}/${lang}/reset-password?token=${token}`;

  // Envoie de l'email avec Handlebars
  try {
    await sendEmail(
      email,
      'Reset your password – InovaGrow',
      'reset-password',
      {
        name: user.name || 'there',
        resetLink,
        year: new Date().getFullYear()
      }
    );

    return json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    return json({ success: false, error: 'Email sending failed' }, { status: 500 });
  }
}
