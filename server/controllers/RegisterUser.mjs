export const RegisterUser = async (req, res) => {
    try {
        const { email, password, username, mobileNumber } = req.body;
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user"
        })
    }


}