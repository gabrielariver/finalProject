import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value || null
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user._id); 
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
