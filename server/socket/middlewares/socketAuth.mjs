import User from "../../models/User.mjs"

const socketAuth = async (socket, next) => {
    try {
        const { token } = socket.handshake.auth; // Extract the token sent from the client
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        // Use that token to retrieve the user in the db
        const user = await User.findById(token);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = user;
        next();
    } catch (error) {
        next(new Error("Authentication error"));
    }
}

export default socketAuth;