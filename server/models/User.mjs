import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { gfs } from "../config/gridfs-setup.mjs";

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        minLength: 8,
        maxLength: 16,
        match: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 13,
        match: /^[a-zA-Z0-9_]+$/,
    },
    mobileNumber: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        unique: true,
        minLength: 8,
        maxLength: 15,
    },
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images.files'
    },
    authProvider: {
        type: String,
        required: true,
        enum: ['local', 'google'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (e) {
        return next(e);
    }
})

UserSchema.post('findOneAndDelete', async (document) => {
    if (document && document.profileImage) {
        try {
            await gfs.delete(document.profileImage);
        } catch (error) {
            console.error(`Error deleting user proifle image with ID ${document.profileImage._id}: `, error);
        }
    }
})

export default mongoose.model("User", UserSchema);