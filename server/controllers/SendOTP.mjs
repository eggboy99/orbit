import nodemailer from "nodemailer";
import OTPSchema from "../models/OTPSchema.mjs";

// Create the transporter with your email service configurations
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'orbit.organization.team@gmail.com',
        pass: 'aygy gitu digo qxua',
    }
});

// The function expects an object with recipient (note the spelling), subject, and message
const sendEmail = async ({ recipient, subject, message }) => {
    try {
        const result = await transporter.sendMail({
            from: 'orbit.organization.team@gmail.com',
            to: recipient,
            subject: subject,
            text: message,      // Plain text version
            html: message       // HTML version
        });

        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export default sendEmail;