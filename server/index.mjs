import express from 'express';
import cors from "cors";
import authenticationRouter from './routes/authentication.mjs';
import connectDB from './database/connect.mjs';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport-config.mjs';
import './config/google-oauth-config.mjs';
import exploreRouter from './routes/explore.mjs';
import User from './models/User.mjs';
import mongoose from 'mongoose';
import { gfs } from './config/gridfs-setup.mjs';

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
        maxAge: 1000 * 60 * 60,
        secure: false,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/api', authenticationRouter);
app.use('/api', exploreRouter);
app.use('/api/retrieve-user-profile/:id', async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User does not exists in the database",
        })
    }

    const baseUrl = "http://localhost:3000";
    const profileImageUrl = `${baseUrl}/api/retrieve-profileImage/${user.profileImage._id}`;
    return res.status(200).json({
        success: true,
        username: user.username,
        rating: user.rating,
        userProfileImage: profileImageUrl,
    })
})

app.get('/api/retrieve-profileImage/:id', async (req, res) => {
    try {
        const imageId = new mongoose.Types.ObjectId(req.params.id);
        const downloadStream = gfs.openDownloadStream(imageId);

        // Connect the donwload stream directly to the HTTP response
        downloadStream.pipe(res).on('error', (error) => {
            console.log('Image not found: ', error);
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});