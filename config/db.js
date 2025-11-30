import mongoose from "mongoose";

export const connectDB=async()=>
{
    const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/storeDB';
     try {
        await mongoose.connect(DB_URI); 
        console.log(`mongo connected succesfuly to ${DB_URI}`);        
    } catch (error) {
        console.log(`mongo connection falied`, error.message);        
    }
};