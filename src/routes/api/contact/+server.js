import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const { name, email, subject, message } = await request.json();

  console.log('Données reçues :', { name, email, subject, message });
  if (!name || !email || !message) {
    return json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  console.log('📧 GMAIL_USER:', process.env.GMAIL_USER);
  console.log('🔑 GMAIL_PASS:', process.env.GMAIL_PASS);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });


console.log('Données reçues :', { name, email, subject, message });

try {
  const result = await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: process.env.TO_EMAIL,
    subject: subject || 'Formulaire de contact',
    html: `<p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`
  });

  console.log('✅ Email envoyé:', result);
  return json({ success: true, message: 'Message sent!' });
} catch (err) {
  console.error('❌ Erreur SMTP:', err);
  return json({ success: false, message: 'Échec de l’envoi de l’e-mail.' }, { status: 500 });
}

}
