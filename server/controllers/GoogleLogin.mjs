// GoogleLogin.mjs
import passport from "passport";

const GoogleLogin = passport.authenticate('google', {
    scope: ['profile', 'email']
});

export default GoogleLogin;