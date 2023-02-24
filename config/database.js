// const MONGO_URI="mongodb://0.0.0.0:27017/SocialMedia";
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
// console.log(process.env)
mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("Database connection succesfull"))
.catch((e)=>console.log("no connection in Database"+e))
