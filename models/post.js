const mongoose=require("mongoose");

const PostSchema=new mongoose.Schema({
  username:{
    type:String,
    required:false,
  },
  caption:{
    type:String
    
  },post:{
    type:String
  },
  postId:{
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
  like:{
    type:String,
  },
  comment:{
    type:String,
  },
  share:{
    type:String,
  },
  userId:{
    type:String
  }
})

const Post=new mongoose.model("post",PostSchema);

module.exports=Post;