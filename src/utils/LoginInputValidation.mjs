export default function LoginInputValidation(input, getValues) {
    if (input.name === "email") {
        return {
            required: "Email address is required",
            pattern: {
                value: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                message: "Invalid email format",
            },
        };
    } else if (input.name === "password") {
        return {
            required: "Password is required",
        };
    }

    return {};
}