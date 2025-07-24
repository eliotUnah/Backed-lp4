"use strict";
const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

// Login con Firebase y guardar JWT en cookie httpOnly
const loginWithFirebase = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken, true);
    const { uid, email } = decoded;

    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email });
    }

    const token = jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login exitoso", user });
  } catch (error) {
    console.error("❌ Error autenticando:", error);

    if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({ error: "Token revocado. Inicia sesión nuevamente." });
    }

    if (error.code === "auth/argument-error") {
      return res.status(403).json({ error: "Token mal formado o inválido." });
    }

    res.status(500).json({ error: "Error verificando token" });
  }
};

// Obtener usuario autenticado leyendo JWT desde cookie
const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Falta token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = { loginWithFirebase, getCurrentUser }; 