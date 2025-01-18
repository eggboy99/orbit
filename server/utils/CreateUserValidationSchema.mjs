import { body } from 'express-validator';

export const CreateUserValidationSchema = [
    // Email Validation
    body('email')
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    // Password Validation
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .withMessage('Password must contain at least one number, uppercase, lowercase, and special character'),

    // Confirm Password Validation
    body('confirmPassword')
        .notEmpty().withMessage("Pasword confirmation is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password do not match");
            }

            return true;
        }),

    // Username Validation
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 13 }).withMessage('Username must be between 3 and 13 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contains letters, numbers, and underscores'),

    // Mobile Number Validation 
    body('mobileNumber')
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^(\+?[1-9]\d{1,14})$/).withMessage('Invalid mobile number')
        .custom((value) => {
            // Remove any spaces or special characters except +
            const cleanNumber = value.replace(/[^\d+]/g, '');
            if (cleanNumber.length < 8 || cleanNumber.length > 15) {
                throw new Error('Mobile numer must be between 8 and 15 digits');
            }
            return true;
        })

]
