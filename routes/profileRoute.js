const express = require("express");
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
const router = express.Router();
const Profile = require("../models/profileSchema")
const multer = require("multer")
const middleware = require('../middleware/middleware')


// controller require
const profileData = require("../controllers/userController")
const getProfileData = require("../controllers/userController")
const updateProfile = require("../controllers/userController")


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
var cpUpload_post = upload.fields([{ name: "profile", maxCount: 1 }, { name: "noProfilePic", maxCount: 1 }]);



router.get("/getProfileData", middleware, profileData.getProfileData);

router.post("/updateProfile", cpUpload_post, middleware, updateProfile.updatedData);

module.exports = router; 