const express = require("express");
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
const router = express.Router();
// const Profile = require("../models/profileSchema")
const Story=require("../models/storyUpload")

const multer = require("multer")
const middleware = require('../middleware/middleware')
const storyUpload=require("../controllers/userController")
const storyGet=require("../controllers/userController")
const storyGetAll=require("../controllers/userController")
// const storyAutoDelete=require("../controllers/userController")
// controller require
// const profileData = require("../controllers/userController")
// const getProfileData = require("../controllers/userController")
// const updateProfile = require("../controllers/userController")


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

 
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
var cpUpload_post = upload.fields([{ name: "story", maxCount: 1 }, { name: "noProfilePic", maxCount: 1 }]);



// router.get("/getProfileData", middleware, profileData.getProfileData);

router.post("/storyUpload/:id", cpUpload_post, middleware, storyUpload.storyUpload);
router.get("/storyGet/:id", middleware, storyGet.storyGet);
router.get("/storyGetAll",middleware,storyGetAll.storyGetAll)

// router.delete("/storyAutoDelete/:id",middleware,storyAutoDelete.storyAutoDelete)

module.exports = router;