// routes/categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require('../middlewares/authenticateUser');
// ✅ Crear categoría

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "❌ El nombre de la categoría es requerido" });
    }

    const category = await Category.create({ name: name.trim(), userId });
    res.status(201).json({ message: "✅ Categoría creada", category });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
});

// ✅ Obtener todas las categorías personalizadas del usuario
router.get("/", authMiddleware, async (req, res) => {
  const categories = await Category.find({ userId: req.user.uid });
  res.json(categories);
});

// ✅ Eliminar categoría
router.delete("/:id", authMiddleware, async (req, res) => {
  const result = await Category.deleteOne({ _id: req.params.id, userId: req.user.uid });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Categoría no encontrada o no te pertenece" });
  }
  res.json({ message: "Categoría eliminada" });
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "❌ El nombre de la categoría es requerido" });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name: name.trim() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "❌ Categoría no encontrada o no te pertenece" });
    }

    res.json({ message: "✅ Categoría actualizada", category });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
});

module.exports = router;

