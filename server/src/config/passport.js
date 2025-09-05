import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Verificar si las credenciales de GitHub están configuradas
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL || '/auth/github/callback';

const isOAuthConfigured = clientID && 
                         clientSecret && 
                         clientID !== 'temp_client_id_for_dev' && 
                         clientSecret !== 'temp_client_secret_for_dev';

if (isOAuthConfigured) {
  console.log('🔐 Configurando GitHub OAuth Strategy...');
  
  // Configuración de la estrategia de GitHub
  passport.use(new GitHubStrategy({
    clientID,
    clientSecret,
    callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Buscar si el usuario ya existe
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        // Usuario existente - actualizar información
        user.username = profile.username;
        user.displayName = profile.displayName || profile.username;
        user.avatarUrl = profile.photos?.[0]?.value;
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }
      
      // Crear nuevo usuario
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatarUrl: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl,
        lastLogin: new Date()
      });
      
      return done(null, user);
    } catch (error) {
      console.error('Error en autenticación GitHub:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️ GitHub OAuth no configurado correctamente');
  console.log('Para habilitar OAuth:');
  console.log('1. Ve a https://github.com/settings/applications/new');
  console.log('2. Configura GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET en .env');
  console.log('3. La aplicación funcionará sin OAuth por ahora (usando sistema legacy)');
}

// Serialización del usuario para la sesión
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialización del usuario desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Exportar si OAuth está configurado para uso en rutas
export { isOAuthConfigured };
export default passport;
