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
const userComment=require("../controllers/userController")
const getComment=require("../controllers/userController") 


const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
var cpUpload_post = upload.fields([{ name: "profile", maxCount: 1 }, { name: "profilePic", maxCount: 1 }]);



router.post("/:id",cpUpload_post,middleware,userPostData.userPostData);
router.get("/getPostData/:id",cpUpload_post,middleware,getPostData.getPostData);
router.post("/comment/:id",userComment.userComment);
router.get("/comment/:id",getComment.getComment);

  
module.exports = router;






// 63844cd1d3b90a46b1ad9798


// 638d6c4d188d4f17cab08c8f



// 95969798
// Jmb@0825,jmb@8532,Jmb@7736,Hjb@0825,Hjb@8532,Jmb@@130
// 9909150973



// 638d6c7f188d4f17cab08c95