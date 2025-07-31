// utils/mailer.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const FROM_EMAIL = process.env.FROM_EMAIL; // Ej: no-reply@tudominio.com
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_KEY || !FROM_EMAIL) {
  throw new Error('Falta configuración de SendGrid. Verifica SENDGRID_API_KEY y FROM_EMAIL en .env');
}

sgMail.setApiKey(SENDGRID_KEY);

const sendReminderEmail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    throw new Error('sendReminderEmail requiere: to, subject y html');
  }

  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.response?.body || error.message);
    throw error;
  }
};

module.exports = { sendReminderEmail };
