import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛤️ Chemin vers les templates Handlebars
const templatesDir = path.resolve(process.cwd(), 'src/lib/templates/emails');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs', // Important
      partialsDir: templatesDir,
      layoutsDir: templatesDir,
      defaultLayout: false
    },
    viewPath: templatesDir,
    extName: '.hbs'
  })
);

export async function sendEmail(to, subject, template, context = {}) {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      template, // ex: 'verify' (sans .hbs)
      context
    });
    console.log(`✉️ Email "${template}" envoyé à ${to}`);
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error; // 🔁 Laisser l'erreur remonter
  }
}

export async function sendVerificationEmail(to, name, token, lang = 'en') {
  const verifyUrl = `${process.env.BASE_URL}/${lang}/verify-email?token=${token}&lang=${lang}`;

  await sendEmail(
    to,
    'Verify your email – InovaGrow',
    'verify',
    { name, verifyLink: verifyUrl }
  );
}
