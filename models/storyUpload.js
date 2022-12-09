const mongoose=require("mongoose");

const storySchema=new mongoose.Schema({
  story:{
    type:String,
  },
  userId:{
    type:String
  },
})

const Story=new mongoose.model("story",storySchema);

module.exports=Story;