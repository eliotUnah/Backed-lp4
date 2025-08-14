// controllers/numericCheckinController.js
"use strict";
const NumericCheckin = require("../models/numericCheckinModel");
const Habit = require("../models/habits-model");
const mongoose = require("mongoose");

exports.addNumericCheckin = async (req, res) => {
  try {
    console.log("📥 Request recibido en addNumericCheckin");
    console.log("➡️ Params:", req.params);
    console.log("➡️ Body:", req.body);
    console.log("➡️ Headers:", req.headers);
    console.log("➡️ Usuario:", req.user);

    const { id } = req.params; // habitId
    const { value } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      console.log("❌ Usuario no autenticado");
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!id) {
      console.log("❌ Habit ID no proporcionado");
      return res.status(400).json({ message: "Habit ID requerido" });
    }

    if (typeof value !== "number" || value <= 0) {
      console.log("❌ Valor inválido:", value);
      return res.status(400).json({ message: "El valor debe ser un número mayor a 0" });
    }

    const habit = await Habit.findOne({ _id: id, userId });
    if (!habit) {
      console.log("❌ Hábito no encontrado para este usuario");
      return res.status(404).json({ message: "Hábito no encontrado" });
    }

    const checkin = await NumericCheckin.create({
      habitId: id,
      userId,
      value,
      date: new Date()
    });

    console.log("✅ Check-in creado:", checkin);
    res.status(201).json({
      message: "Check-in numérico agregado correctamente",
      checkin
    });
  } catch (error) {
    console.error("❌ Error en addNumericCheckin:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


exports.getNumericCheckins = async (req, res) => {
  try {
    console.log("📥 Request recibido en getNumericCheckins");
    console.log("➡️ Params:", req.params);
    console.log("➡️ Usuario:", req.user);

    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      console.log("❌ Usuario no autenticado");
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Habit ID inválido:", id);
      return res.status(400).json({ message: "Habit ID inválido" });
    }

    const checkins = await NumericCheckin.find({ habitId: id, userId })
      .sort({ date: -1 });

    console.log("✅ Checkins encontrados:", checkins);
    res.json(checkins);
  } catch (error) {
    console.error("❌ Error en getNumericCheckins:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};