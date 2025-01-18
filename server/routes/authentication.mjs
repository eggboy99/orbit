import { Router } from 'express';
import { ValidateRegistrationInput } from '../middleware/ValidateRegistrationInput.mjs';
import { RegisterUser } from '../controllers/RegisterUser.mjs';

const authenticationRouter = Router();

authenticationRouter.post('/register', ValidateRegistrationInput, RegisterUser);

authenticationRouter.post('/login', (req, res) => {
    res.status(200).json(req.body);
})

export default authenticationRouter;