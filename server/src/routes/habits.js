import express from "express";
const router = express.Router();

import Habit from "../models/Habit.js";
import { ensureAuth } from "../middlewares/auth.js"; // si usas middleware de auth

// GET /api/habits → listar hábitos del usuario
router.get("/", ensureAuth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener hábitos" });
  }
});

// POST /api/habits → crear hábito
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { name, color, emoji } = req.body;
    const habit = await Habit.create({ user: req.user._id, name, color, emoji });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: "Error al crear hábito" });
  }
});

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const { name, color, emoji } = req.body;
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, color, emoji },
      { new: true }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar hábito" });
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Hábito eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar hábito" });
  }
});

export default router;
