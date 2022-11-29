const mongoose=require("mongoose");

const otpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  code:String,
  expiryIn:Number,
},{
  timestamps:true
})


const otp=new mongoose.model("otp",otpSchema,'otp');
 
module.exports=otp;

