const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  story: {
    type: String,
  },
  userId: {
    type: String
  },
  username: {
    type: String
  },
  userProfile: {
    type: String
  },
  time: { type: String, default: Date.now },
  // time: { type: new Timestamp() }

  })

const Story = new mongoose.model("story", storySchema);

module.exports = Story;