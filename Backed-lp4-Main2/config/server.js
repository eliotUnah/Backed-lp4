"use strict";
require('dotenv').config({ path: 'config/.env' });

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const redisClient = require("../utils/redisClient");


const app = express();
app.use(cookieParser()); 

app.use(cors({
  origin: "http://localhost:3000",  // ✅ el frontend que puede hacer peticiones
  credentials: true                 // ✅ permite enviar/recibir cookies
}));

// 📦 Rutas
const router = require("../routes/router");
const authRoutes = require("../routes/auth-routes");
const checkinRoutes = require("../routes/checkin-routes");
const reminderRoutes = require("../routes/reminderRoutes");
const emailRoutes = require("../routes/email-routes"); // 🚀 NUEVO: para pruebas de correo
const statsRoutes = require('../routes/stats-routes');
const achievementRoutes = require('../routes/achievementRoutes');
const aiRoutes = require('../routes/ai');
const googleRoutes = require("../routes/google_routes");
const calendarRoutes = require("../routes/calendar-routes");
const rankingRoutes = require("../routes/ranking-routes");
const friendRoutes = require('../routes/friends-routes');
const moodRoutes = require("../routes/moodRoutes");
const categoryRoutes = require('../routes/Category');
const habitsRoutes = require('../routes/habits');
const exportRouter = require('../routes/export-routes');
const userPreferencesRoutes = require("../routes/user-preferences");
const landingRoutes = require("../routes/landigRoutes");
const numericCheckinRoutes = require("../routes/numeric-checkin-routes");
const objectivesRoutes = require("../routes/objectives-routes");
// 📘 Modelos
const Habit = require('../models/habits-model');

// 🔧 Middlewares globales
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());

// 🌐 Rutas públicas
app.use('/auth', authRoutes);
app.use('/api', landingRoutes);
// 🔐 Rutas protegidas
app.use(router);
app.use('/habits', checkinRoutes);
app.use('/reminders', reminderRoutes);
app.use('/', statsRoutes);
app.use('/api', achievementRoutes);
app.use("/ai", aiRoutes); 
app.use("/habits", checkinRoutes);
app.use("/integrations/google", googleRoutes);
app.use("/calendar", calendarRoutes); 
app.use("/", rankingRoutes);
app.use('/friends', friendRoutes); // ✅ Rutas de amigos
app.use("/api", moodRoutes);
app.use('/categories', categoryRoutes);
app.use('/habits', habitsRoutes);
app.use('/api', exportRouter);
app.use("/api/users/preferences", userPreferencesRoutes);
app.use("/api/numeric-checkins", numericCheckinRoutes);
app.use("/api", objectivesRoutes);
// ✉️ Rutas para correos
app.use('/api/email', emailRoutes); // ✅ endpoint de prueba de correo

// 🧠 Configuración MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.set('strictQuery', false);

// 🛠 Asegura índice de texto para búsquedas
async function ensureTextIndex() {
  try {
    await Habit.collection.createIndex({ title: "text" });
    console.log("🔍 Índice de texto en 'title' asegurado ✅");
  } catch (err) {
    console.error("❌ Error al crear índice de texto:", err.message);
  }
}

// 🚀 Conexión a Mongo y arranque de servidor
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Conectado a MongoDB con Mongoose');
  await ensureTextIndex();

  // ⏰ Inicia el cron de recordatorios (envío automático de correos)
  require('../services/reminderScheduler');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB:', error);
  process.exit(1);
});
