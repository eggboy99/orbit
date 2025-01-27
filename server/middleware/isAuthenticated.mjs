export const isAuthenticated = (req, res) => {
    console.log(req.session);
    // Check if the user is authenticated using Passport's built-in method
    if (req.isAuthenticated() && req.user) {
        // If authenticated, return user information (excluding sensitive data)
        return res.status(200).json({
            isAuthenticated: req.isAuthenticated(),
            user: {
                id: req.user._id,
                email: req.user.email,
                username: req.user.username
            },
        });
    } else {
        return res.status(401).json({
            isAuthenticated: req.isAuthenticated(),
            user: null
        })
    }
};