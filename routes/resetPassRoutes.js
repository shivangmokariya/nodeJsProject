const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

const router=express.Router();
const resetPassword=require("../controllers/userController")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

router.post("/",resetPassword.resetPassword);

module.exports=router;