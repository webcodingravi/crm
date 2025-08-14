import mongoose from "mongoose";
const connectDB=async () => {
    try {
        mongoose.connection.on("connected", () => console.log("Database Successfully Connected"))
        await mongoose.connect(process.env.MONGODB_URL)

    }
    catch (error) {
        console.log("Failed Connected with Databased", error.message)
    }
}

export default connectDB;