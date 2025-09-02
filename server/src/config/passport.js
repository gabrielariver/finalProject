import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
  scope: ["user:email"], 
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    console.log("Perfil recibido:", profile);

    const existingUser = await User.findOne({ githubId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      githubId: profile.id,
      name: profile.displayName || profile.username || "Usuario",
      email: profile.emails?.length > 0 ? profile.emails[0].value : null,
      avatar: profile.photos?.[0]?.value || null
    });

    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
