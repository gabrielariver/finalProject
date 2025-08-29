import { Router } from 'express';
import passport from '../config/passport.js';

const router = Router();

router.get('/github', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: 'http://localhost:5173/dashboard',
  })
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/');
  });
});

export default router;
