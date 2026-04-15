import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true
        });
        
        console.log("database connected succussfully");
    } catch (error) {
        console.log("error while connecting to db",error);
        process.exit(1);
    }
}
export default connectDb;