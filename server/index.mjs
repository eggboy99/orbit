import express from 'express';
import cors from "cors";
import authenticationRouter from './routes/authentication.mjs';
import connectDB from './database/connect.mjs';

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase the limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));
connectDB();

app.use('/api', authenticationRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});