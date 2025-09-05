import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// Ruta para iniciar autenticación con GitHub
router.get('/github', passport.authenticate('github', { 
  scope: ['user:email'] 
}));

// Callback de GitHub OAuth
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Autenticación exitosa
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}?auth=success`);
  }
);

// Ruta para logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
});

// Ruta para obtener usuario actual
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl,
        email: req.user.email
      },
      authenticated: true
    });
  } else {
    res.json({ 
      authenticated: false,
      user: null 
    });
  }
});

// Ruta para verificar estado de autenticación
router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      avatarUrl: req.user.avatarUrl
    } : null
  });
});

export default router;
