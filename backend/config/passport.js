
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback").replace('https://https://', 'https://'),
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }

            // If not, check if email exists (link accounts logic optional, here strictly new or by email if unique)
            const userByEmail = await User.findOne({ email: profile.emails[0].value });
            if (userByEmail) {
                // Link Google ID to existing email account
                userByEmail.googleId = profile.id;
                userByEmail.avatar = profile.photos[0].value;
                await userByEmail.save();
                return done(null, userByEmail);
            }

            // Create new user
            const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatar: profile.photos[0].value,
                password: '', // No password for Google users
                role: 'client',
                isAdmin: false
            });

            await newUser.save();
            done(null, newUser);

        } catch (error) {
            done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
