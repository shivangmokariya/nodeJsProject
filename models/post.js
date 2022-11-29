const mongoose=require("mongoose");

const PostSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true,
  },
  caption:{
    type:String
    
  },profilePic:{
    type:String
  },
  userPost:{
    type:String,
  },
  hashTag:{
    type:String,
  },
  location:{
    type:String
  },
  like:[{
    type:Number,
  }],
  comment:[{
    type:String,
  }],
  share:[{
    type:Number,
  }],
  userId:{
    type:String
  }
})

const Post=new mongoose.model("post",PostSchema);

module.exports=Post;