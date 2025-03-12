import socketAuth from "./middlewares/socketAuth.mjs";
import Message from "../models/Messages.mjs";
import User from "../models/User.mjs";

export default (io) => {
    io.use(socketAuth);
    io.on("connection", async (socket) => {
        socket.on("joinRoom", async ({ productId, senderId, recipientId }) => {
            const senderRoom = `${senderId}-${productId}`;
            const recipientRoom = `${recipientId}-${productId}`;
            const rooms = [senderRoom, recipientRoom];
            socket.join(rooms);

        })

        socket.on("sendMessage", async ({ productId, senderId, recipientId, message }) => {
            try {
                await Message.findOneAndUpdate({ productId: productId, senderId: senderId, recipientId: recipientId },
                    { $set: { message: message } },
                    { new: true }
                );
            } catch (error) {
                console.error("Error saving message: ", error);
            }
        })

        socket.on("disconnect", async (reason) => {
            console.log(`User: ${socket.id} disconnected. Reason: ${reason}`);
        });

    })
};