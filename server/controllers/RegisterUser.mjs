import User from "../models/User.mjs";
import OTP from "../models/OTPSchema.mjs";
import bcrypt from "bcrypt";
import { uploadImage } from "../config/gridfs-setup.mjs";
import sendEmail from "./SendOTP.mjs";


export const RegisterUser = async (req, res) => {
    try {
        const { email, password, username, mobileNumber, image, googleId } = req.body;
        // Submitted image data comes as a base64 string and we need to convert it to binary data
        // for computers to handle. 
        const imageBuffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
        );

        // Create a unique name for the image file 
        const imageName = `profile-${Date.now()} - ${username}`

        // Send the image to GridFS storage system and get back an id
        const fileId = await uploadImage(imageName, imageBuffer, {
            type: 'profile',
            username: username
        });
        const newUser = new User({
            googleId,
            email,
            password,
            username,
            mobileNumber,
            profileImage: fileId,
            authProvider: 'local',
        });


        const emailExists = await User.exists({ email: newUser.email });
        const usernameExists = await User.exists({ username: newUser.username });
        const mobileNumberExists = await User.exists({ mobileNumber: newUser.mobileNumber });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email address is already in use",
                key: 'email',
            })
        } else if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username is taken",
                key: 'username',
            })
        } else if (mobileNumberExists) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is already in use",
                key: 'mobileNumber',
            })
        }

        req.session.pendingUser = newUser;

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await OTP.create({
            email,
            otp: await bcrypt.hash(otp, 10)
        });

        const subject = "Registration Email Verification";
        const message = `Please use the following One Time Password: ${otp}. This OTP will expire in 5minutes.`

        try {
            await sendEmail({
                recipient: email,
                subject: subject,
                message: message
            });

        } catch (error) {
            console.error('Email sending failed:', error);
        }

        res.status(201).json({
            success: true,
            redirectTo: `/authentication/verify/${newUser._id}`,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "There is something wrong with the server. Please try again later."
        })
    }
}