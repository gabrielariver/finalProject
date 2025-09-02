import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autorizado' });
  }
console.log("👤 Usuario desde backend:", req.user);
  res.json({
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
});
export default router;
