import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/orbit");
        console.log("MongoDB Database Connected Successfully.");
    } catch (error) {
        console.log("MongoDB Connection Failed: ", error);
    }
};


export default connectDB;