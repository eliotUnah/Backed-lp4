// controllers/emailController.js
const { sendReminderEmail } = require('../utils/mailer');
const testEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Faltan campos: to, subject y message son obligatorios.' });
    }

    await sendReminderEmail(to, subject, `<p>${message}</p>`);

    res.status(200).json({ message: `✅ Correo enviado a ${to}` });
  } catch (error) {
    console.error('❌ Error al enviar correo de prueba:', error);
    res.status(500).json({ error: 'Hubo un error al intentar enviar el correo.' });
  }
};

module.exports = { testEmail };
