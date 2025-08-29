import express from "express";
const router = express.Router();

import { ensureAuth } from "../middlewares/auth.js";

router.get("/", ensureAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

export default router;
