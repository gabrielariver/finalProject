import express from 'express';
import Habit from '../models/Habit.js';
import { requireClient } from '../middleware/requireClient.js';
const router = express.Router();

router.get('/', requireClient, async (req, res) => {
  const items = await Habit.find({ clientId: req.clientId }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', requireClient, async (req, res) => {
  const { name, color, emoji } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: 'name required' });
  const habit = await Habit.create({
    clientId: req.clientId,
    name: name.trim(),
    color: color || '#7c3aed',
    emoji: emoji || '🔥'
  });
  res.status(201).json(habit);
});

export default router;
