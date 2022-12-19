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
const getPostDataAll = require("../controllers/userController")
const userComment=require("../controllers/userController")
const getComment=require("../controllers/userController")
const deletePost=require("../controllers/userController")
const likeUpdate=require("../controllers/userController")
const unlikeUpdate=require("../controllers/userController")


const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
var cpUpload_post = upload.fields([{ name: "profile", maxCount: 5 }, { name: "profilePic", maxCount: 5 }]);

router.post("/:id",cpUpload_post,middleware,userPostData.userPostData);
router.get("/getPostData/:id",cpUpload_post,middleware,getPostData.getPostData);
router.get("/getPostDataAll",middleware,getPostDataAll.getPostDataAll);
router.delete("/deletePost/:id",middleware,deletePost.deletePost);

router.post("/comment/:id",userComment.userComment);
router.get("/comment/:id",getComment.getComment);

router.put("/like/:id",middleware,likeUpdate.likeUpdate)
router.put("/unLike/:id",middleware,unlikeUpdate.unlikeUpdate)


module.exports = router;


