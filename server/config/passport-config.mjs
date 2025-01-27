import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.mjs";

// Use LocalStrategy to look for an email and check the password for verifications
passport.use(new LocalStrategy({
    usernameField: 'email', // Tell passport to use email field instead of username
    passwordField: 'password',
}, async (email, password, done) => {  // Syntax for done function (err, user, mesage)
    try {
        // Find if the user does exists in our database
        const user = await User.findOne({ email });

        // If user does not exist or the password input is wrong, we return an error message
        const isMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        if (!user || !isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        } else {
            // Return users if validation succeed
            return done(null, user);
        }

    } catch (error) {
        return done(error);
    }
}))

// Instead of storing the entire user data into the session system, we only stores the user.id for quick reference
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// When a request comes in with a session, deserializeUser uses the session id (user.id) to find the complete data
// of the user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
