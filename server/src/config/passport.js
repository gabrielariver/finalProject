import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// --- Configuración de OAuth ---
console.log('🔐 OAuth Config:', {
  clientID: process.env.GITHUB_CLIENT_ID?.slice(0,8) + '...',
  callbackURL: process.env.GITHUB_CALLBACK_URL
});

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

if (!clientID || !clientSecret) {
  console.error('❌ Error: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET faltan en .env');
  process.exit(1);
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); }
  catch (e) { done(e, null); }
});

function safeUsername(profile) {
// intenta obtener un username razonable y seguro
  const login =
    profile?.username ||
    profile?._json?.login ||
    (profile?.emails?.[0]?.value ? profile.emails[0].value.split('@')[0] : null) ||
    `gh_${profile?.id}`;
  return String(login).replace(/\s+/g, '').slice(0, 50);
}
function safeName(profile, username) {
  return profile?.displayName || profile?._json?.name || username;
}
function safeAvatar(profile) {
  return profile?.photos?.[0]?.value || profile?._json?.avatar_url || null;
}
function safeEmail(profile) {
  return profile?.emails?.[0]?.value || profile?._json?.email || null;
}

// Estrategia de GitHub
passport.use(new GitHubStrategy(
  { clientID, clientSecret, callbackURL },
  async (_access, _refresh, profile, done) => {
    try {
      // buscamos por el campo "githubId" 
      let user = await User.findOne({ githubId: profile.id });

      // valores seguros
      const username = safeUsername(profile);
      const displayName = safeName(profile, username);
      const avatarUrl = safeAvatar(profile);
      const email = safeEmail(profile);
      const profileUrl = profile?.profileUrl || profile?._json?.html_url || null;

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username,                
          displayName,
          email,
          avatarUrl,
          profileUrl,
          lastLogin: new Date()
        });
      } else {
        // refresca datos visibles si están vacíos
        user.username    = user.username    || username;
        user.displayName = user.displayName || displayName;
        user.avatarUrl   = user.avatarUrl   || avatarUrl;
        user.email       = user.email       || email;
        user.profileUrl  = user.profileUrl  || profileUrl;
        user.lastLogin   = new Date();
        await user.save();
      }

      return done(null, user);
    } catch (e) {
      return done(e, null);
    }
  }
));

export default passport;
