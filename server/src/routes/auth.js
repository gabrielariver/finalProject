import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// --- Login con GitHub ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// --- Callback de GitHub ---
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect:
      (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login',
  }),
  (req, res) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Autenticación exitosa → vuelve al front
    res.redirect(`${frontendURL}?auth=success`);
  }
);

// --- Logout (GET y POST) ---
function doLogout(req, res, next) {
  const hadUser = !!req.user;

  req.logout(err => {
    if (err) return next(err);

    req.session?.destroy(() => {
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false
      });
      res.cookie('connect.sid', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false
      });

      return res.status(200).json({
        ok: true,
        hadUser,
        message: 'Sesión cerrada y cookie invalidada'
      });
    });
  });
}

router.post('/logout', doLogout);
router.get('/logout', doLogout);

// --- Usuario actual (opcional) ---
router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ authenticated: false, user: null });
  }
  const u = req.user;
  return res.json({
    authenticated: true,
    user: {
      id: u._id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      email: u.email,
    },
  });
});

// --- Status siempre 200 (simplifica frontend) ---
router.get('/status', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ authenticated: false, user: null });
  }
  return res.json({ authenticated: true, user: req.user });
});

export default router;
