const Profile = require("../models/profileSchema")
const fs = require('fs');
const jwt = require("jsonwebtoken");
require('dotenv').config("/config/config.env");
const { connect } = require("../config/database");
const SignUp = require("../models/signUp");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require('cors');
const bodyParser = require("body-parser");
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



module.exports.registration = async (req, res) => {
  try {
    const useremail = await SignUp.findOne({ email: req.body.email });
    if (useremail) {
      res.status(100).send({
        message: "email already exits.",
        status: 100,
      });
    }
    console.log(req.body);
    const user = new SignUp(req.body)

    console.log(req.body);

    const token = await user.generateAuthToken();

    res.status(200).send({
      message: "user reqisterd successfully",
      status: 200,
      data: user,
      token: token
    });
    console.log(user);
    await user.save();


  } catch (e) {
    console.log('error', e);
    res.status(400).send({
      message: "user not reqisterd.",
      status: 400,
      error: e
    });
  }
}


// Displaying all the users of Database API

module.exports.getRegisterData = async (req, res) => {
  try {
    const userData = await SignUp.find();
    res.send(userData);
  } catch (e) {
    res.status(401).send(e);
  }
}






// ---------------------------------------------------------




module.exports.profileData = async (req, res) => {
  // console.log(req.file)
  try {
    // console.log("file profile --------- ",req.files.profile);

    // console.log("bodddyyyyyyyyyyyyyyyyyyy",req.body);
    console.log(req.files.profile);
    if (req.files.profile) {


      let oldName = "uploads/" + req.files.profile[0].filename;
      let filePath = "uploads/" + req.files.profile[0].filename + req.files.profile[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      const filePathMove = 'uploads/' + req.files.profile[0].filename + req.files.profile[0].originalname;
      // console.log("success!" + filePathMove)

      const userProfile = new Profile({
        name: req.body.name,
        phone_no: req.body.phone_no,
        bio: req.body.bio,
        files: filePathMove
      });
      await userProfile.save();

      var data = req.body
      data.files = filePathMove
      res.status(200).send({
        message: "Profile saved successfully.",
        data: data
      })
      // res.send({message: "File Saved",files: filePathMove});
    } else {


      const data = req.body
      const userProfile = new Profile({
        name: req.body.name,
        phone_no: req.body.phone_no,
        bio: req.body.bio,
        files: ""
      });
      await userProfile.save();
      console.log(data)
      res.status(200).send({
        message: "Profile saved successfully",
        data: data
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "data not saved correctly", e: e });
  }
}

module.exports.getProfileData = async (req, res) => {
  try {
    console.log(req._id, '*---------------req.user._id ')
    const userData = await SignUp.findById(req._id);
    res.send(userData);
  } catch (e) {
    res.send("error - ", e)
  }
};

module.exports.checkUser = async (decoded, result) => {
  // console.log('RAJ decoded._id KANANI: --' + decoded._id);
  const userData = await SignUp.findById(decoded._id);
  // console.log('RAJ KANANI: --' + userData);
  result(null, userData);
  return;
};



module.exports.updatedData = async (req, res) => {
  try {

    if (req.files.profile) {
      console.log(req.files);
      let oldName = "uploads/" + req.files.profile[0].filename;
      let filePath = "uploads/" + req.files.profile[0].filename + req.files.profile[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      var filePathMove = 'uploads/' + req.files.profile[0].filename + req.files.profile[0].originalname;
      // console.log("success!" + filePathMove)
    } else {
      var filePathMove = req.user.profile;

    }
    console.log(req._id);
    const updatedData = await SignUp.updateOne({ _id: req._id }, {
      $set: {
        name: req.body.name,
        phone_no: req.body.phone_no,
        bio: req.body.bio,
        profile: filePathMove
      }
    })
    // await userProfile.save();
    console.log(req.body.name);
    var data = req.body
    data.files = filePathMove
    res.status(200).send({
      message: "Profile saved successfully.",
      data: updatedData
    })
    // res.send({message: "File Saved",files: filePathMove});

  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "data not saved correctly--", e: e });
  }
}
// ---------------------------------------------------------
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    const useremail = await SignUp.findOne({ email: email });
    const hPassword = await bcrypt.compare(password, useremail.password);

    console.log("useremail", useremail);

    // console.log(hPassword);
    if (hPassword == true) {
      // const token = await useremail.generateAuthToken();
      // console.log(token);
      // const token = jwt.sign({ _id: useremail._id.toString() }, process.env.SECRET_KEY);
      res.status(200).send({
        message: "user login successfully",
        status: 200,

        data: useremail
      });
      // console.log(useremail);
    } else {
      res.status(400).send({
        message: "user not login ",
        status: 400,
        error: "Login details are else invalid"
      })
    }
  } catch (e) {
    res.status(400).send({
      message: "user not registered ",
      status: 400,
      error: "Login details are catch invalid",
    });
  }
}
// ---------------------------------------------------------

module.exports.resetPassword = async (req, res) => {
  try {
    const user = await SignUp.find({ email: req.body.email })
    if (user) {
      //  console.log(user);
      // console.log(user[0].password);
      // console.log(dataBasePassword);
      userPassword = await req.body.password;
      userCPassword = await req.body.cPassword;
      //  console.log(userPassword);
      //  console.log(userCPassword);


      if (userPassword == userCPassword) {
        // console.log(`current password is ${userPassword}`);
        userPasswordHash = await bcrypt.hash(userPassword, 10);
        // console.log(userPasswordHash);
        userCPasswordHash = await bcrypt.hash(userCPassword, 10);
        // console.log(userCPasswordHash);
        // console.log(user);
        const updatedData = await SignUp.updateOne({ email: req.body.email }, { $set: { password: userPasswordHash, cPassword: userCPasswordHash } })
        // await user.save();
        // console.log(updatedData);
        // console.log(user);
        // console.log(`hashed password is ${this.password}`);
        res.status(200).send({
          message: "password successfully reset.",
          status: 200,
          data: user
        });
      } else {
        // console.log("enter same password in both field");
        res.status(400).send({
          message: "Enter same password in both field",
          status: 400,
          data: "error"
        })
      }
    } else {
      // console.log("enter correct email address");
      res.status(400).send({
        message: "enter correct email address",
        status: 400,
        data: "error"
      })
    }
  } catch (e) {
    res.status(400).send({
      message: "Enter valid Email address",
      status: 400,
      data: e
    })
  }
}
// ---------------------------------------------------------
const otp = require("../models/otpSchema");
const nodemailer = require("nodemailer");



module.exports.otpSend = async (req, res) => {
  const data = await SignUp.findOne({ email: req.body.email });
  // console.log(data);
  if (data) {
    var otpCode = 2000 + Math.floor(Math.random() + Math.random() * 900);
    // console.log( typeof(otpCode));

    const otpData = new otp({
      email: req.body.email,
      code: otpCode,
      expiryIn: new Date().getTime() + 1000 * 1000
    });
    const otpResponse = await otpData.save();
    res.status(200).send({
      message: "user otp successfully",
      status: 200,
      data: otpResponse
    });
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: 'vedantrakholiya@gmail.com',
        pass: 'jauwbrpvouchznds'
      }
    });

    let mailOptions = {
      from: 'memee-app.dignizant@gmail.com',
      to: req.body.email,
      subject: 'Sending Email from memee-app.dignizant@gmail.com',
      // text: `Your OTP is ${otpCode}`,
      html:
        `<html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Static Template</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              margin: 0;
              font-family: 'Poppins', sans-serif;
              background: #FFFFFF;
              font-size: 14px;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 45px 30px 60px;
                background: #F4F7FF;
                background-image: url(https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg);
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
              "
            >
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <img
                          alt=""
                          src="https://drive.google.com/file/d/1j1RjtSkLEj8hFxqaX9fsNmebaoFaCK2u/view" 
                          height="30px"
                        />
                      </td>
                      <td style="text-align: right;">
                        <span
                          style="font-size: 16px; line-height: 30px; color: #black;"
                          >${currentdate}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>
              <main>
                <div
                  style="
                    margin: 0;
                    margin-top: 70px;
                    padding: 92px 30px 115px;
                    background: #FFFFFF;
                    border-radius: 30px;
                    text-align: center;
                  "
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 500;
                        color: #1F1F1F;
                      "
                    >
                      
                    </h1>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-size: 16px;
                        font-weight: 500;
                      "
                    >
                      Hey User,
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-weight: 500;
                        letter-spacing: 0.56px;
                      "
                    >
                      Thank you for choosing Memee App. Use the following OTP
                      to complete the procedure to change your email address. OTP is
                      valid for
                      <span style="font-weight: 600; color: #1F1F1F;">5 minutes</span>.
                      Do not share this code with others, including Memee
                      employees.
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 60px;
                        font-size: 40px;
                        font-weight: 600;
                        letter-spacing: 25px;
                        color: #BA3D4F;
                      "
                    >
                    ${otpCode}
                    </p>
                  </div>
                </div>
                <p
                  style="
                    max-width: 400px;
                    margin: 0 auto;
                    margin-top: 90px;
                    text-align: center;
                    font-weight: 500;
                    color: #8C8C8C;
                  "
                >
                 <p> Need help? Ask at</p>
                  <a
                    href="mailto:archisketch@gmail.com"
                    style="color: #499FB6; text-decoration: none;">MemeeAppSupport@gmail.com</a>
                  or visit our
                  <a
                    href=""
                    target="_blank"
                    style="color: #499FB6; text-decoration: none;"
                    >Help Center</a
                  >
                </p>
              </main>
              <footer
                style="
                  width: 100%;
                  max-width: 490px;
                  margin: 20px auto 0;
                  text-align: center;
                  border-top: 1px solid #E6EBF1;
                "
              >
                <p
                  style="
                    margin: 0;
                    margin-top: 40px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #434343;
                  "
                >
                 Memee App
                </p>
                <p style="margin: 0; margin-top: 8px; color: #434343;">
                  Address 540, City, State.
                </p>
                <div style="margin: 0; margin-top: 16px;">
                  <a href="" target="_blank" style="display: inline-block;">
                    <img
                      width="36px"
                      alt="Facebook"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                    />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Instagram"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                  /></a>
                  <a
                    href=""
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Twitter"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
                    />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    style="display: inline-block; margin-left: 8px;"
                  >
                    <img
                      width="36px"
                      alt="Youtube"
                      src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
                  /></a>
                </div>
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © 2022 MemeeApp. All rights reserved.
                </p>
              </footer>
            </div>
          </body>
        </html>  `
        

    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } else {
    res.status(400).send({
      message: "email id is incorrect",
      status: 400,
      data: "error"
    })
  } 
}
// ----------------------------------------------------

const Post=require("../models/post")



module.exports.userPostData=async(req,res)=>{
   try{
    console.log(req.params.id,"-----------------.id");
    console.log(req.files);
    if (req.files.profile) {
      // console.log(req.files);
      let oldName = "uploads/" + req.files.profile[0].filename;
      let filePath = "uploads/" + req.files.profile[0].filename + req.files.profile[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      var filePathMove = 'uploads/' + req.files.profile[0].filename + req.files.profile[0].originalname;
      // console.log("success!" + filePathMove)
    } else {
      var filePathMove = req.user.profile;

    }
    if (req.files.profilePic) {
      // console.log(req.files);
      let oldName = "uploads/" + req.files.profilePic[0].filename;
      let filePath = "uploads/" + req.files.profilePic[0].filename + req.files.profilePic[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      var filePathMove2 = 'uploads/' + req.files.profilePic[0].filename + req.files.profilePic[0].originalname;
      // console.log("success!" + filePathMove)
    } else {
      var filePathMove2 = req.user.profilePic;

    }

//     console.log(req.files.profile[0].path);
//     console.log(req.files.profilePic[0].path);
// console.log(filePathMove2);

    const userPost = new Post({
      username:req.body.username,
      caption:req.body.caption,
      location:req.body.location,
      like:req.body.like,
      comment:req.body.comment,
      share:req.body.share,
      userPost:filePathMove,
      profilePic:filePathMove2,
      userId:req.params.id,
    
    });
await userPost.save();
    
    res.send(userPost);
   }catch(e){
    res.send(e);
    console.log(e);
   }
}

module.exports.getPostData=async(req,res)=>{
  console.log( req.params.id);
  try{
    
    const postData=await Post.findOne({userId:req.params.id})

    res.send(postData)
  }catch(e){
res.send(e);
  }
}














