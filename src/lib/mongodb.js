import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    const db = await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB || "EPDS_DB"
    });
    isConnected = db.connections[0].readyState;
};