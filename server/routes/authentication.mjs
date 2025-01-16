import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/register', (req, res) => {
    res.status(200).json(req.body);
})

authenticationRouter.post('/login', (req, res) => {
    res.status(200).json(req.body);
})

export default authenticationRouter;