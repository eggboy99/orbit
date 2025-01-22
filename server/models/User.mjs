import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
        required: true,
        unique: true,
        minLength: 8,
        maxLength: 15,
    },
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images.files'
    },
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

export default mongoose.model("User", UserSchema);