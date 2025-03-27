import mongoose from "mongoose"

export const connectDB =async()=> {
    await mongoose.connect("mongodb+srv://nethikarhemalatha:Hema6281@foodcluster0.gdhca.mongodb.net/?retryWrites=true&w=majority&appName=foodCluster0").then(()=>console.log("DB connected"));
}