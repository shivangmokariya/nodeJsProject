const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
    
  },
  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
  phone_no:{
    type:String,
    required:false,
  },
  profile: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  followers: [{
    type: String,
    required: false,
  }],
  following: [{
    type: String,
    required: false,
  }],
  tokens:[{
    token:{
        type:String, 
        required:true
    }
}]
});
  
registerSchema.methods.generateAuthToken = async function () {
  try {
    token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    console.log(token);
    this.tokens = this.tokens.concat({ token: token })
    if (this.tokens) {
      // console.log("already token");
    } else {
      this.save();
    }

    return token;

  } catch (e) {
    // res.send(e);
    console.log(e);
  }
}

// converting password into hash
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    this.cPassword = await bcrypt.hash(this.cPassword, 10);
    // this.confirmPassword=await bcrypt.hash(this.confirmPassword,10);
    console.log(`hashed password is ${this.password}`);
  }
  next();
})





const SignUp = new mongoose.model("SignUp", registerSchema);

module.exports = SignUp;
