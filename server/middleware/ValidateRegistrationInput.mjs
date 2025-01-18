import { validationResult } from "express-validator";
import { CreateUserValidationSchema } from "../utils/CreateUserValidationSchema.mjs"

export const ValidateRegistrationInput = async (req, res, next) => {
    try {
        // Promise.all() allows validations to run concurrently rather than one after another (makes our validation process faster)
        await Promise.all(CreateUserValidationSchema.map(validation => validation.run(req)));

        // validationResult access the stored validation results in the request object
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                // Converts errors object into an array then we map each error to create a new object with just what we need
                errors: errors.array().map(error => ({
                    field: error.param,
                    message: error.msg
                }))
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server validation error occured'
        })
    }
};