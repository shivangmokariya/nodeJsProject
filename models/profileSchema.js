const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  phone_no:{
    type:String,
    min:10,
    max:14,
  },
  bio:{
    type:String
  },
  files:{
    type:String,
    
  }
})

const Profile=new mongoose.model("profile",profileSchema);

module.exports=Profile;