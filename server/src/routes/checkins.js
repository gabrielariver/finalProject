import express from 'express';
import Checkin from '../models/Checkin.js';
import { requireClient } from '../middleware/requireClient.js';
const router = express.Router();

router.post('/today', requireClient, async (req, res) => {
  const { habitId } = req.body || {};
  if (!habitId) return res.status(400).json({ error: 'habitId required' });
  const day = new Date().toISOString().slice(0,10);

  const existing = await Checkin.findOne({ clientId: req.clientId, habitId, day });
  if (existing) { await existing.deleteOne(); return res.json({ toggled: false }); }

  await Checkin.create({ clientId: req.clientId, habitId, day });
  res.json({ toggled: true });
});

export default router;
