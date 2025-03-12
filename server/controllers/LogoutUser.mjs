import User from "../models/User.mjs";
export const LogoutUser = async (req, res, next) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date()
    });

    req.logout(async (error) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({ success: true, redirect: "/" })
    })
}