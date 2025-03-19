import socketAuth from "./middlewares/socketAuth.mjs";
import Message from "../models/Messages.mjs";

export default (io) => {
    io.use(socketAuth);
    io.on("connection", async (socket) => {
        socket.on('joinAllRooms', async ({ user }) => {
            const messages = await Message.find({
                $or: [
                    { senderId: user },
                    { recipientId: user },
                ]
            });
            messages.forEach((message) => {
                const senderId = message.senderId;
                const recipientId = message.recipientId;
                const productId = message.productId;
                let room = [senderId, recipientId].sort();
                room = `${room[0]}-${room[1]}-${productId}`;
                console.log(`User: ${socket.user.username} joined room: ${room}`);
                socket.join(room);
            })

        })
        socket.on("joinRoom", async ({ productId, senderId, recipientId }) => {
            let room = [senderId, recipientId].sort();
            room = `${room[0]}-${room[1]}-${productId}`;
            console.log(`User: ${socket.user.username} joined room: ${room}`)
            socket.join(room);
        })

        socket.on("sendMessage", async ({ productId, senderId, recipientId, message }) => {
            try {
                const updatedMessage = await Message.findOneAndUpdate({
                    productId: productId,
                    $or: [
                        { senderId: senderId, recipientId: recipientId },
                        { senderId: recipientId, recipientId: senderId },
                    ]
                },
                    { $set: { message: message } },
                    { new: true }
                );

                let room = [senderId, recipientId].sort();
                room = `${room[0]}-${room[1]}-${productId}`;
                socket.join(room);
                console.log(`Message: ${updatedMessage} sent to room: ${room}`);
                io.to(room).emit('receiveMessage', updatedMessage);
                console.log("Message emitted successfully.");
            } catch (error) {
                console.error("Error saving message: ", error);
            }
        })

        socket.on('getChatHistory', async ({ productId, senderId, recipientId }) => {
            try {
                let messages = await Message.find({
                    productId: productId,
                    $or: [
                        { senderId: senderId, recipientId: recipientId },
                        { senderId: recipientId, recipientId: senderId },
                    ]
                }).sort({ createdAt: 1 });

                let room = [senderId, recipientId].sort();
                room = `${room[0]}-${room[1]}-${productId}`;
                console.log(`Retrieve message from room: ${room}`)
                socket.join(room);
                io.to(room).emit('messageHistory', messages);
            } catch (error) {
                console.error("Error saving message: ", error);
            }
        })

        socket.on("disconnect", async (reason) => {
            console.log(`User: ${socket.user.username} disconnected.`);
        });

    })
};