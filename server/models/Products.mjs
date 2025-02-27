import mongoose from "mongoose";
import { gfs } from "../config/gridfs-setup.mjs";

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    condition: {
        type: String,
        required: true,
        trim: true,
    },
    productImages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images.files'
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

ProductSchema.post('findOneAndDelete', async (document) => {
    if (document && document.productImages && document.productImages.length > 0) {
        for (const fileId of document.productImages) {
            try {
                console.log(fileId);
                await gfs.delete(fileId);
            } catch (error) {
                console.error(`Error deleting file with ID ${fileId}: `, error);
            }
        }
    }
})

export default mongoose.model('Product', ProductSchema);
