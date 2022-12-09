const mongoose=require("mongoose");

const CommentSchema=new mongoose.Schema({
  comment:{
    type:String,
  },
  userId:{
    type:String
  },
  postId:{
    type:String
  },
 
})

const Comment=new mongoose.model("comment",CommentSchema);

module.exports=Comment;