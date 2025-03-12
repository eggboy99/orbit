import passport from "passport";
import User from "../models/User.mjs";

export const LoginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            })
        }

        // If user not found, send back appropriate message to the client side
        if (!user) {
            return res.status(400).json({
                success: false,
                message: info.message,
            })
        }

        req.login(user, async (err) => {
            if (err) {
                console.log('Session creation error: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Session Error'
                })
            }

            // Update the isOnline field to true. This is to track the online status of the user
            await User.findByIdAndUpdate(user._id, { isOnline: true });

            // If session is created successfully, send back user info
            return res.status(200).json({
                success: true,
                redirectTo: '/',
            });
        });
    })(req, res, next);
}; 