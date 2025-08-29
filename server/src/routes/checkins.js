import express from "express";
const router = express.Router();

import Checkin from "../models/Checkin.js";   
import { ensureAuth } from "../middlewares/auth.js";  

router.post("/:habitId", ensureAuth, async (req, res) => {
  const userId = req.user._id;
  const habitId = req.params.habitId;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const checkin = await Checkin.create({ user: userId, habit: habitId, date: today });
    return res.json(checkin);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Ya registraste hoy" });
    }
    return res.status(500).json({ message: "Error" });
  }
});

export default router;
