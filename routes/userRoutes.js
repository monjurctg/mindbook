const express = require("express");
const {addUser,loginUser,changePassword} = require('../controlers/userControler')
const router = express.Router();


// post user
router.post("/register",addUser)
router.post('/login',loginUser)
router.put('/change-password',changePassword)


module.exports = router