require('dotenv').config("/config/config.env");
const { connect } = require("../config/database");
const SignUp = require("../models/signUp");
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const otp = require("../models/otpSchema");
const nodemailer=require("nodemailer");
const router=express.Router();
const middelware=require("../middleware/middleware")

let registration;
registration = require("../controllers/userController");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const getRegisterData=require("../controllers/userController")
const followers=require("../controllers/userController")
const unfollow=require("../controllers/userController")



router.post("/",registration.registration);


router.get("/", getRegisterData.getRegisterData);

router.put("/followers",middelware,followers.followers)
router.put("/unfollow",middelware,unfollow.unfollow)


module.exports=router;