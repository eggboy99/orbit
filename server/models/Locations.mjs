import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
    },
    region: String,
    subzones: [{
        type: String,
        trim: true,
        unique: true,
    }],
})

export default mongoose.model('Locations', LocationSchema);