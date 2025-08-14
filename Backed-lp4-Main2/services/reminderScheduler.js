// services/reminderScheduler.js
const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('../models/reminder'); // Asegúrate de ajustar la ruta
const { sendReminderEmail } = require('../utils/mailer');


// ⏱ Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  try {
    const nowUTC = moment.utc();

    // Buscar todos los recordatorios activos
    const reminders = await Reminder.find({ active: true }).populate('habitId', 'title');

    for (const reminder of reminders) {
      const currentUserTime = nowUTC.clone().tz(reminder.timezone).format('HH:mm');

      if (currentUserTime === reminder.time) {
        const title = reminder.habitId?.title || 'tu hábito';

        // 💌 Enviar correo de recordatorio
        await sendReminderEmail(
          reminder.email,
          '⏰ ¡Es hora de tu hábito!',
          `
            <p>Hola 👋</p>
            <p>Este es tu recordatorio para <strong>${title}</strong>.</p>
            <p>¡Ánimo! 💪 Sigue construyendo buenos hábitos.</p>
          `
        );

        console.log(`📨 Email enviado a ${reminder.email} para el hábito "${title}"`);
      }
    }
  } catch (error) {
    console.error('❌ Error al ejecutar el recordatorio programado:', error);
  }
});

