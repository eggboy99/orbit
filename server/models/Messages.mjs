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
        type: String,
    },

    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'images.files' }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

MessageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });
MessageSchema.pre('save', function (next) {
    if (this.message === "" && this.images.length === 0) {
        next(new Error("Message must contain either text or images"));
    } else {
        next();
    }
})

export default mongoose.model("Message", MessageSchema);