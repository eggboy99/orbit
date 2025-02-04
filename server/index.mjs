import express from 'express';
import cors from "cors";
import authenticationRouter from './routes/authentication.mjs';
import connectDB from './database/connect.mjs';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport-config.mjs';
import './config/google-oauth-config.mjs';

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 5,
        secure: false,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/api', authenticationRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});