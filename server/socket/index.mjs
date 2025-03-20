import socketAuth from "./middlewares/socketAuth.mjs";
import Message from "../models/Messages.mjs";
import User from "../models/User.mjs";
import mongoose from "mongoose";

export default (io) => {
    io.use(socketAuth);
    const connectedUsers = new Map();
    io.on("connection", async (socket) => {
        if (socket.user && socket.user._id) {
            await User.findByIdAndUpdate(socket.user._id, {
                isOnline: true,
                lastSeen: new Date()
            });

            if (!connectedUsers.has(socket.user._id)) {
                connectedUsers.set(socket.user._id, new Set());
            }
            connectedUsers.get(socket.user._id).add(socket.id);
            io.emit('userStatusChange', {
                userId: socket.user._id,
                onlineStatus: true,
                lastSeen: null
            });
        }
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
                // console.log(`User: ${socket.user.username} joined room: ${room}`);
                socket.join(room);
            })

        })
        socket.on("joinRoom", async ({ productId, senderId, recipientId }) => {
            let room = [senderId, recipientId].sort();
            room = `${room[0]}-${room[1]}-${productId}`;
            // console.log(`User: ${socket.user.username} joined room: ${room}`)
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
                socket.join(room);
                io.to(room).emit('messageHistory', messages);
            } catch (error) {
                console.error("Error saving message: ", error);
            }
        })

        socket.on('getOnlineStatus', async ({ userId }) => {
            const user = await User.findById(userId);
            const onlineStatus = user.isOnline;
            const lastSeen = user.lastSeen
            io.emit('retrieveOnlineStatus', { userId: userId, onlineStatus: onlineStatus, lastSeen: lastSeen });
        })

        socket.on("disconnect", async (reason) => {
            if (socket.user && socket.user._id) {
                if (connectedUsers.has(socket.user._id)) {
                    connectedUsers.get(socket.user._id).delete(socket.id);

                    if (connectedUsers.get(socket.user._id).size === 0) {
                        connectedUsers.delete(socket.user._id);
                        const now = new Date();
                        await User.findByIdAndUpdate(socket.user._id, {
                            isOnline: false,
                            lastSeen: now
                        });
                        io.emit('userStatusChange', {
                            userId: socket.user._id,
                            onlineStatus: false,
                            lastSeen: now
                        });
                    }
                }
            }
        });

    })
};