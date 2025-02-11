import passport from "passport";

export const GoogleOAuthCallback = (req, res, next) => {
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
}