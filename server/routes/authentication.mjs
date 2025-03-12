import { Router } from 'express';
import { ValidateRegistrationInput } from '../middleware/ValidateRegistrationInput.mjs';
import { RegisterUser } from '../controllers/RegisterUser.mjs';
import { LoginUser } from '../controllers/LoginUser.mjs';
import { isAuthenticated } from '../middleware/isAuthenticated.mjs';
import GoogleLogin from '../controllers/GoogleLogin.mjs';
import { GoogleOAuthCallback } from '../handlers/authenticationHandler.mjs';
import { VerifyUser } from '../controllers/VerifyUser.mjs';
import { LogoutUser } from '../controllers/LogoutUser.mjs';
import User from '../models/User.mjs';

const authenticationRouter = Router();

authenticationRouter.post('/register', ValidateRegistrationInput, RegisterUser);

authenticationRouter.post('/auth/register/verify', VerifyUser);

authenticationRouter.post('/login', LoginUser);

authenticationRouter.post('/logout', LogoutUser);

authenticationRouter.get('/auth/google', GoogleLogin);

authenticationRouter.get('/auth/google/callback', GoogleOAuthCallback)

authenticationRouter.get('/auth/status', isAuthenticated);

authenticationRouter.get('/auth/user-online-status/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const onlineStatus = user.isOnline;
    const lastSeen = user.lastSeen;
    res.json({ online: onlineStatus, lastSeen });
})



export default authenticationRouter;