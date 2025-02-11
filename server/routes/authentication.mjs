import { Router } from 'express';
import { ValidateRegistrationInput } from '../middleware/ValidateRegistrationInput.mjs';
import { RegisterUser } from '../controllers/RegisterUser.mjs';
import { LoginUser } from '../controllers/LoginUser.mjs';
import { isAuthenticated } from '../middleware/isAuthenticated.mjs';
import GoogleLogin from '../controllers/GoogleLogin.mjs';
import { GoogleOAuthCallback } from '../handlers/authenticationHandler.mjs';
import { VerifyUser } from '../controllers/VerifyUser.mjs';

const authenticationRouter = Router();

authenticationRouter.post('/register', ValidateRegistrationInput, RegisterUser);

authenticationRouter.post('/auth/register/verify', VerifyUser);

authenticationRouter.post('/login', LoginUser);

authenticationRouter.get('/auth/google', GoogleLogin);

authenticationRouter.get('/auth/google/callback', GoogleOAuthCallback)

authenticationRouter.get('/auth/status', isAuthenticated);

export default authenticationRouter;