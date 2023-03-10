const Profile = require("../models/profileSchema")
const fs = require('fs');
const jwt = require("jsonwebtoken");
require('dotenv').config("/config/config.env");
const { connect } = require("../config/database");
const SignUp = require("../models/signUp");
const Story = require("../models/storyUpload");
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
      res.send({
        status: 100,
        message: "email already exists."
      })
    } else {
      // console.log(req.body);
      const user = new SignUp(req.body);

      // console.log(req.body);

      const token = await user.generateAuthToken();

      res.status(200).send({
        message: "user reqisterd successfully",
        status: 200,
        data: user,
        token: token
      });
      // console.log(user);
      await user.save();
    }

  } catch (e) {
    // console.log('error', e);
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
    // console.log(req.files.profile);
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
      // console.log(data)
      res.status(200).send({
        message: "Profile saved successfully",
        data: data
      });
    }
  } catch (e) {
    // console.log(e);
    res.status(400).send({ message: "data not saved correctly", e: e });
  }
}

module.exports.getProfileData = async (req, res) => {
  try {
    // console.log(req._id, '*---------------req.user._id ')
    const userData = await SignUp.findById(req._id);
    res.send(userData);
  } catch (e) {
    res.send("error - ", e)
  }
};

module.exports.getProfileDataById = async (req, res) => {
  try {
    const getProfile = await SignUp.findById(req.params.id)
    res.send(getProfile)
  } catch (e) {
    res.send("error - ", e)
  }
}

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
    // console.log(req._id);
    const updatedData = await SignUp.findByIdAndUpdate({ _id: req._id, }, {
      $set: {
        name: req.body.name,
        phone_no: req.body.phone_no,
        bio: req.body.bio,
        profile: filePathMove
      }
    }, { new: true })

    // await userProfile.save();
    // console.log(req.body.name);
    var data = req.body
    data.files = filePathMove
    if (!req.files.profile) {
      res.status(200).send({
        status: 200,
        message: "Profile pic not saved.",
        data: updatedData
      })
    } else {
      res.status(200).send({
        status: 200,
        message: "Profile saved successfully.",
        data: updatedData
      })
    }
    // res.send({message: "File Saved",files: filePathMove});

  } catch (e) {
    // console.log(e);
    res.status(400).send({ status: 200, message: "data not saved correctly--", e: e });
  }
}
// ---------------------------------------------------------
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email);
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
      data: e,
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
        // console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
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

const Post = require("../models/post")




module.exports.userPostData = async (req, res) => {
  try {
    // console.log(req.params.id, "-----------------.id");
    // console.log(req.files);
    if (req.files.profile) {
      // console.log(req.files);
      let oldName = "uploads/" + req.files.profile[0].filename;
      let filePath = "uploads/" + req.files.profile[0].filename + req.files.profile[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      var filePathMove = 'uploads/' + req.files.profile[0].filename + req.files.profile[0].originalname;
      // console.log("success!---------------------------" + filePathMove)
    } else {
      var filePathMove = req.files.profile;
    }




    //     console.log(req.files.profile[0].path);
    //     console.log(req.files.profilePic[0].path);
    // console.log(filePathMove2);



    // console.log(req._id, '*---------------req.user._id ')
    const userData = await SignUp.findById(req.params.id);
    // console.log(userData);

    // var digits = parseInt((Math.random() * 900000563146840) + 10054691000);
    // console.log(digits);


    const userPost = new Post({
      username: req.body.username,
      caption: req.body.caption,
      location: req.body.location,
      hashTag: req.body.hashTag,
      like: req.body.like,
      comment: req.body.comment,
      share: req.body.share,
      userPost: filePathMove,
      userId: req.params.id,

    });
    await userPost.save();

    res.status(200).send({
      status: 200,
      userPost: userPost,
    });
  } catch (e) {
    res.status(400).send({
      status: 400,
      error: e
    });
    // console.log(e);
  }
}
const Comment = require("../models/comment")

module.exports.userComment = async (req, res) => {
  //   console.log(req.params.id);
  // const id=req.params.id;

  try {

    // console.log(req.body);
    const userComment = new Comment({
      userId: req.params.id,
      comment: req.body.comment,

      postId: req.body.postId,
      // profilePic:profilePic.profile,
      // username:profilePic.name,

    })

    await userComment.save();
    res.send(userComment)
  } catch (e) {
  }
}


module.exports.getComment = async (req, res) => {
  try {
    var getComments = await Comment.find({ postId: req.params.id });
    var data = []
    // console.log(getComments);
    for (let index = 0; index < getComments.length; index++) {
      data = []
      data = await SignUp.findById({ _id: getComments[index].userId })
      getComments[index].username = data.name;
      getComments[index].userProfile = data.profile;
      // console.log("yughdfu",data.profile);
    }
    // const getComments = await Comment.find({ postId: req.params.id });
    await getComments.reverse();
    // console.log(getComments.length);
    res.send(getComments);

  } catch (e) {

  }
}

module.exports.likeUpdate = async (req, res) => {
  // console.log(req.user._id);
  // const checkLike=await Post.find({_id:req.params.id},{like:req.user._id})
  // console.log(checkLike,"--------fffffffffffffhjhjhjhjhjhjhjhj");
  // console.log(req.user);
  const likesData = await Post.findByIdAndUpdate(req.params.id, {

    $push: { like: req.user._id }
  }, {
    new: true
  })
  if (!likesData) {
    return res.status(400).json({ error: "err" })
  } else {
    res.status(200).json(likesData);
  }

}
module.exports.unlikeUpdate = async (req, res) => {
  const likesData = await Post.findByIdAndUpdate(req.params.id, {
    $pull: { like: req.user._id }
  }, {
    new: true
  })
  if (!likesData) {
    return res.status(400).json({ error: "error" })
  } else {
    res.status(200).json(likesData);
  }
}

module.exports.deletePost = async (req, res) => {
  try {
    const deletedData = await Post.deleteOne({ _id: req.params.id })
    res.send(deletedData);
  } catch (e) {
    res.send(e, "error")
  }
}


module.exports.getPostDataAll = async (req, res) => {
  try {
    // console.log("booooooooo,");
    // const userDetails= await SignUp.find();
    var postData = await Post.find();
    var data = []
    var comment = []
    // console.log(userDetails);
    try {
      for (let index = 0; index < postData.length; index++) {
        data = []
        data = await SignUp.findById({ _id: postData[index].userId })
        comment = await Comment.find({ postId: postData[index]._id })
        postData[index].username = data.name;
        postData[index].userProfile = data.profile;
        postData[index].userBio = data.bio;
        postData[index].following = data.following;
        postData[index].followers = data.followers;
        // console.log(data.followers);
        postData[index].comment = comment.length;
      }

      const response = await res.send({
        postData: postData.reverse(),
      })
    }
    catch (e) {
      res.send({
        error: e,
      })
    }

  } catch (e) {

  }
}



module.exports.getPostData = async (req, res) => {
  // console.log(req.params.id);


  try {

    const userDetails = await SignUp.findOne({ _id: req.params.id });
    const postData = await Post.find({ userId: req.params.id });
    // console.log(userDetails.profile);


    for (let index = 0; index < postData.length; index++) {
      data = []
      data = await SignUp.findById({ _id: postData[index].userId })
      postData[index].following = data.following;
      postData[index].followers = data.followers;
      // console.log(data.followers);
    }




    res.send({
      status: 200,
      postData: postData,
      userProfilePic: userDetails.profile,
    })
  } catch (e) {
    res.send(e);
  }
}
// const cron=require("cron");
const cron = require('node-cron')
var time = Date.now()
module.exports.storyUpload = async (req, res) => {
  // console.log(cron);

  try {
    // console.log(req.body);
    // console.log(req.params.id, "-----------------.id"); 
    // console.log(req.files);
    if (req.files.story) {
      // console.log(req.files);
      let oldName = "uploads/" + req.files.story[0].filename;
      let filePath = "uploads/" + req.files.story[0].filename + req.files.story[0].originalname;
      fs.rename(oldName, filePath, () => {
      });
      var filePathMove = 'uploads/' + req.files.story[0].filename + req.files.story[0].originalname;
      // console.log("success!" + filePathMove)
    } else {
      var filePathMove = req.user.story;
    }

    // console.log(filePathMove,"======================");
    const story = new Story({
      story: filePathMove,
      userId: req.params.id,
    })
    await story.save();
    res.status(200).send({
      status: 200,
      data: story,
    });
  } catch (e) {
    res.send({
      status: 400,
      data: "enter correct data"
    })
  }
}



cron.schedule('* * * * * *', async () => {



    try {
      const checkStory = await Story.find()


      for (let index = 0; index < checkStory.length; index++) {
        const element = checkStory[index];
        // console.log(element.time);
        const DiffTime = Date.now() - parseInt(element.time);
        // console.log(DiffTime<=86400000);
        const over24H = DiffTime >= 86400000
        // console.log("DiffTime",DiffTime);
        // console.log(over24H, 86400000);
        if (over24H) {
          const DeleteStory = await Story.deleteOne({ id: element._id })
          // res.status(200).send({ status: 200, message: "story is deleted because of it was more then 24 hours" })
        }
      }
    } catch (e) {
      // res.send({ error: e })
    }
 



})



module.exports.storyAutoDelete = async (req, res) => {

  try {
    const checkStory = await Story.find()


    for (let index = 0; index < checkStory.length; index++) {
      const element = checkStory[index];
      // console.log(element.time);
      const DiffTime = Date.now() - parseInt(element.time);
      // console.log(DiffTime<=86400000);
      const over24H = DiffTime >= 86400000
      // console.log("DiffTime",DiffTime);
      // console.log(over24H,86400000);

      if (over24H) {
        const DeleteStory = await Story.deleteOne({ id: element._id })
        res.status(200).send({ status: 200, message: "story is deleted because of it was more then 24 hours" })
      }

    }

  } catch (e) {
    res.send({ error: e })
  }
}

// 86400000
// console.log(parseInt(Date.now()));
// console.log(Date.now() - parseInt(element.time));
// console.log(parseInt(element.time));
module.exports.storyGet = async (req, res) => {

  try {
    const getData = await Story.find({ userId: req.params.id })
    const userData = await SignUp.find({ _id: req.params.id })
    // console.log(getData);
    console.log(userData);
    res.send({
      status: 200,
      data: getData,
      userProfilePic: userData[0].profile,
      username: userData[0].name,
    })
  } catch (e) {

  }
}


const Google = require("../models/google");


module.exports.google = async (req, res) => {
  try {
    const token = req.body.token;
    const google = new Google({
      token: token,
    });
    await google.save()
    res.status(200).send({
      status: 200,
      data: 'error'
    })
  } catch (e) {
    res.status(400).send({
      status: 400,
      data: 'error'
    })
  }
  ;
}

module.exports.storyGetAll = async (req, res) => {
  try {
    const storyGet = await Story.find();
    for (let index = 0; index < storyGet.length; index++) {
      data = []
      data = await SignUp.findById({ _id: storyGet[index].userId })
      storyGet[index].username = data.name;
      storyGet[index].userProfile = data.profile;
    }
    // console.log(storyGet);
    res.send(storyGet.reverse())
  } catch (e) {

  }
}

module.exports.followers = async (req, res) => {

  var data = await SignUp.findByIdAndUpdate(req.body.followid, {
    $push: { followers: req.user._id }
  }, { new: true })
  var data = await SignUp.findByIdAndUpdate(req.user._id, {
    $push: { following: req.body.followid }
  }, { new: true })
  res.status(200).send({
    status: 200,
    data: data,
  })
}

module.exports.unfollow = async (req, res) => {

  var data = await SignUp.findByIdAndUpdate(req.body.unfollowid, {
    $pull: { followers: req.user._id }
  }, { new: true })
  var data = await SignUp.findByIdAndUpdate(req.user._id, {
    $pull: { following: req.body.unfollowid }
  }, { new: true })
  res.status(200).send({
    status: 200,
    data: data,
  })
}

