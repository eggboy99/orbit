export const isAuthenticated = (req, res) => {
    // Check if the user is authenticated using Passport's built-in method
    if (req.isAuthenticated() && req.user) {
        // If authenticated, return user information (excluding sensitive data)
        return res.status(200).json({
            isAuthenticated: req.isAuthenticated(),
            user: {
                id: req.user._id,
                email: req.user.email,
                username: req.user.username,

            },
        });
        // Checks if there is user in the current session. This conditional statement executes when user is not
        // authenticated but has a session in the backend server.
    } else if (req.session.pendingUser) {
        const pendingUser = req.session.pendingUser
        return res.status(200).json({
            user: pendingUser._id,
        })
    }
    else {
        return res.status(401).json({
            isAuthenticated: req.isAuthenticated(),
            user: null
        })
    }
};