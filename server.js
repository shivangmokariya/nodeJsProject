require('dotenv').config("/config/.env");
const { connect } = require("./config/database");
const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const multer=require("multer")
 
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads"));
// Require 
const SignupRoutes=require("./routes/signupRoutes")
const loginRoutes=require("./routes/loginRoutes")
const otpRoutes=require("./routes/otpRoutes")
const resetPasswordRoutes=require("./routes/resetPassRoutes")
const profileRoutes=require("./routes/profileRoute")
const postRoutes=require("./routes/postRoutes")
const googleAuthRoute=require("./routes/googleAuthroute")
const storyRoutes=require("./routes/storyRoutes")




const session = require('express-session'); 

// uses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes API
app.use("/signUp",SignupRoutes);
app.use("/login",loginRoutes);
app.use("/send-email",otpRoutes);
app.use("/reset-password",resetPasswordRoutes);
app.use("/profile",profileRoutes);
app.use("/userpost",postRoutes);
app.use("/google",googleAuthRoute);
app.use("/story",storyRoutes);



// Server

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
})


//  living with tanya ,lasic surgury