import OTP from '../models/OTPSchema.mjs';
import bcrypt from 'bcrypt';
import User from '../models/User.mjs';
import sendEmail from './SendOTP.mjs';
import passport from 'passport';

export const VerifyUser = async (req, res, next) => {
    // This verification conditonal statement executes when users submit the registration form
    if (Object.keys(req.body).length !== 0) {
        try {
            const { otp } = req.body;
            const user = req.session.pendingUser; // Retrieve the user from the session

            // Session expired
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Registration session expired. Please register again.",
                });
            }

            const storedOTP = await OTP.findOne({ email: user.email });

            // OTP expired
            if (!storedOTP) {
                return res.status(400).json({
                    success: false,
                    message: "Verification code expired. Please resend the code."
                })
            }

            const isValidOTP = await bcrypt.compare(otp, storedOTP.otp);
            // Check to see if the otp entered matches the one stored in the database
            if (!isValidOTP) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification code",
                });
            }

            const newUser = new User(user);
            await newUser.save();

            // Clear up the OTP and session memory
            await OTP.deleteOne({ email: user.email });
            delete req.session.pendingUser;

            // Authenticate the new user
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Internal Server Error: Authentication'
                    })
                }

                req.login(newUser, (error) => {
                    if (error) {
                        console.log("User Login Error: ", error);
                        return res.status(500).json({
                            success: false,
                            message: 'Login error after registration'
                        });
                    }

                    // Redirect the user upon successful authentication
                    newUser.verified = true;
                    return res.status(201).json({
                        success: true,
                        message: "User Registration Completed Successfully",
                        redirect: "/",
                    });
                })

            })(req, res, next);

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Registration failed. Please try again.",
            })
        }

        // This conditional statement is executes when user clicks the resend OTP button on the frontend side. 
        // It only executes when request.body is empty (means no form data was submitted on the frontend)
    } else {
        const user = req.session.pendingUser;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const subject = "Registration Email Verification";
        const message = `Please use the following One Time Password: ${otp}. This OTP will expire in 30seconds.`

        await OTP.deleteOne({ email: user.email });

        try {
            await OTP.create({
                email: user.email,
                otp: await bcrypt.hash(otp, 10)
            });

            await sendEmail({
                recipient: user.email,
                subject: subject,
                message: message,
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "User session has expired. Pleaes register again."
            })
        }

    }

}