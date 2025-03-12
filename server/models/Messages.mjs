import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    message: {
        type: String
    },

    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images.files' }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);