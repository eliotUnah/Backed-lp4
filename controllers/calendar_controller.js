const { google } = require("googleapis");
const User = require("../models/user-model");
const Habit = require("../models/habits-model");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 🌱 Sincroniza hábitos como eventos repetitivos en Google Calendar
const syncHabitsToCalendar = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid });

    if (!user || !user.googleTokens) {
      return res.status(403).json({
        message: "🚫 No has vinculado tu calendario de Google"
      });
    }

    oAuth2Client.setCredentials(user.googleTokens);
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const habits = await Habit.find({ userId: uid });

    if (habits.length === 0) {
      return res.status(200).json({ message: "📭 No tienes hábitos registrados aún" });
    }

    const createdEvents = [];

    for (const habit of habits) {
  // Verifica si ya fue sincronizado antes (evita duplicados)
  if (habit.gcalEventId) continue;

  const startDate = new Date(habit.startTime);
  const endDate = new Date(startDate.getTime() + habit.durationMinutes * 60000);

  // ✅ Solo incluir recurrencia si la frecuencia es semanal y hay días válidos
  let recurrence = [];

  if (
    habit.frequency === "Semanal" &&
    Array.isArray(habit.daysOfWeek) &&
    habit.daysOfWeek.length > 0
  ) {
    const byDay = habit.daysOfWeek.join(",");
    recurrence = [`RRULE:FREQ=WEEKLY;BYDAY=${byDay}`];
  }

  const event = {
    summary: `🧠 Hábito: ${habit.title}`,
    description: "Creado automáticamente desde HabitosPro",
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "America/Tegucigalpa"
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "America/Tegucigalpa"
    },
    recurrence, // ← ahora es dinámico y seguro
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 10 }]
    }
  };

  const result = await calendar.events.insert({
    calendarId: "primary",
    resource: event
  });

  habit.gcalEventId = result.data.id;
  await habit.save();

  createdEvents.push(result.data);
}

    res.status(201).json({
      message: "✅ Hábitos sincronizados con éxito",
      events: createdEvents
    });
  } catch (error) {
    console.error("❌ Error al sincronizar hábitos:", error.response?.data || error.message);
    res.status(500).json({ message: "🚨 No se pudo sincronizar los hábitos" });
  }
};

// 🎯 Crea evento de prueba para verificar vinculación
const createTestEvent = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid });

    if (!user || !user.googleTokens) {
      return res.status(400).json({ message: "🚫 El usuario no ha vinculado su calendario" });
    }

    oAuth2Client.setCredentials(user.googleTokens);
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary: "🎯 Evento de prueba desde Habituate",
      description: "Este evento fue creado automáticamente para probar la vinculación con Google Calendar",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "America/Tegucigalpa" // ✅ zona horaria agregada
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/Tegucigalpa" // ✅ zona horaria agregada
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }]
      }
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event
    });

    res.status(201).json({
      message: "✅ Evento creado con éxito",
      event: response.data
    });
  } catch (error) {
    console.error("❌ Error al crear evento:", error.response?.data || error.message);
    res.status(500).json({ message: "🚨 No se pudo crear el evento" });
  }
};

// ✅ Exporta ambas funciones
module.exports = {
  syncHabitsToCalendar,
  createTestEvent
};