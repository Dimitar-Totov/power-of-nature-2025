import mongoose from "mongoose";

export default async function mongooseSetup(){
    try{
        await mongoose.connect('mongodb://127.0.0.1/power-of-nature');
        console.log('Successfully connected to MongoDB');
    } catch(err){
        console.log(err.message);
    }
}