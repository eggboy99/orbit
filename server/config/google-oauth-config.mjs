import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.mjs';
import passport from "passport";

const GOOGLE_CLIENT_ID = '1025742128089-69k2ukrhscolm4jifsikhgosjkjgvrhg.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            // Checks if the google email already exists in the database
            let user = await User.findOne({ email: profile.emails[0].value });

            // If not we create a new user base on the google account details 
            if (!user) {
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    authProvider: 'google',
                })

                // and we return the new user info to the next middlware function
                return cb(null, newUser);
            }

            // else if user does exists in our database we return the existing user data
            return cb(null, user);

        } catch (error) {
            return cb(error, null);
        }
    }
));

// serialize the user id into the session for future session retrieval 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

