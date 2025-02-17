import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    subcategories: [{
        type: String,
        trim: true,
    }]
})

export default mongoose.model("Categories", CategoriesSchema);