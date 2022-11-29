const express = require("express");
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
const router = express.Router();
const multer = require("multer")
const middleware = require('../middleware/middleware')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


// controller require
const userPostData = require("../controllers/userController")
const getPostData = require("../controllers/userController")


const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
var cpUpload_post = upload.fields([{ name: "profile", maxCount: 1 }, { name: "profilePic", maxCount: 1 }]);
// var cpUpload_Post = upload.fields([{ name: "profile", maxCount: 2 }, { name: "noProfilePic", maxCount: 1 }]);


router.post("/:id",cpUpload_post,middleware,userPostData.userPostData)
router.get("/getPostData/:id",cpUpload_post,middleware,getPostData.getPostData)


 
module.exports = router; 




// 63844cd1d3b90a46b1ad9798