export default function RegistrationInputValidation(input, getValues) {
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
            minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
            },
            maxLength: {
                value: 16,
                message: "Password cannot exceed 16 characters",
            },
            pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                message:
                    "Password must consists at least one special, uppercase and lowercase character",
            },
        };
    } else if (input.name === "confirmPassword") {
        return {
            required: "Password confirmation is required",
            validate: (value) => {
                return value === getValues("password") || "Passwords do not match";
            },
        };
    } else if (input.name === "username") {
        return {
            required: "Username is required",
            minLength: {
                value: 3,
                username: "Username must be at least 3 characters",
            },
            maxLength: {
                value: 13,
                username: "Username cannot exceeds 13 characters",
            },
        };
    } else if (input.name === "mobileNumber") {
        return {
            required: "Mobile number is required",
            pattern: {
                value: /^(\+?[1-9]\d{1,14})$/,
                message: "Invalid mobile number",
            },
        };
    }

    return {};
}