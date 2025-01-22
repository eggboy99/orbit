import { body } from 'express-validator';

export const CreateUserValidationSchema = [
    // Email Validation
    body('email')
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(
            { gmail_remove_dots: false, } // Prevent normalization from removing . symbol before @
        ),

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
        }),

    // Image validation
    body('image')
        .notEmpty().withMessage("Profile image is required")
        .custom((value) => {
            // Check if it is a valid base65 image string
            if (!value.startsWith('data:image/')) {
                throw new Error('Invalid image format.');
            }

            // Extract the image type and base64 data
            const [header, base64Data] = value.split(',');
            const allowedTypes = ['jpeg', 'jpg', 'png'];
            const imageType = header.split('/')[1].split(';')[0].toLowerCase();

            if (!allowedTypes.includes(imageType)) {
                throw new Error('Only JPEG, JPG, and PNG images are allowed');
            }

            if (!base64Data) {
                throw new Error("Invalid image data");
            }

            // Check file size
            const sizeInBytes = Buffer.from(base64Data, 'base64').length;
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes

            if (sizeInBytes > maxSize) {
                throw new Error("Image size must not exceed 5MB");
            }

            // Pass all the validation requirements
            return true;
        })


]
