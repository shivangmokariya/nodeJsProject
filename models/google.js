const mongoose=require("mongoose");

const googleSchema=new mongoose.Schema({
  token:{
    type:String,
  },
  userId:{
    type:String,
  },
})

const Google=new mongoose.model("google",googleSchema);

module.exports=Google;