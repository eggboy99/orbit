import { Router } from 'express';
import { ValidateRegistrationInput } from '../middleware/ValidateRegistrationInput.mjs';
import { RegisterUser } from '../controllers/RegisterUser.mjs';
import { LoginUser } from '../controllers/LoginUser.mjs';
import { isAuthenticated } from '../middleware/isAuthenticated.mjs';
import GoogleLogin from '../controllers/GoogleLogin.mjs';
import passport from 'passport';

const authenticationRouter = Router();

authenticationRouter.post('/register', ValidateRegistrationInput, RegisterUser);

authenticationRouter.post('/login', LoginUser);

authenticationRouter.get('/auth/google', GoogleLogin);

authenticationRouter.get('/auth/status', isAuthenticated);

authenticationRouter.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', function (err, user) {
        // If the user Google account is not registered with our web application, we use send the user account details
        // over to the client registration page and prefill the form.
        const userParams = new URLSearchParams();
        if (user?.email || user?.username || user?.googleId) {
            if (user.email) userParams.append('email', user.email);
            if (user.username) userParams.append('username', user.username);
            if (user.googleId) userParams.append('googleId', user.googleId);
        }
        if (!user?.mobileNumber) {
            res.redirect(`http://localhost:5173/authentication?${userParams.toString()}`);
        } else {
            // If the Google account is registered with us, we login the user and redirect them to the home page.
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err,
                    })
                }

                return res.redirect("http://localhost:5173");
            });

        }
    })(req, res, next);
})



export default authenticationRouter;