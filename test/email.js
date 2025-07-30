import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: process.env.TO_EMAIL,
  subject: 'Test SMTP',
  text: 'Ceci est un test'
}, (err, info) => {
  if (err) {
    return console.error('Erreur SMTP:', err);
  }
  console.log('Email envoyé :', info.response);
});
