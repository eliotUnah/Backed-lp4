"use strict";
require('dotenv').config({ path: 'config/.env' });

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

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

// 📘 Modelos
const Habit = require('../models/habits-model');

// 🔧 Middlewares globales
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());

// 🌐 Rutas públicas
app.use('/auth', authRoutes);

// 🔐 Rutas protegidas
app.use(router);
app.use('/habits', checkinRoutes);
app.use('/reminders', reminderRoutes);

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
