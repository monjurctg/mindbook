const express = require("express");
const {addUser,loginUser,changePassword, getUsers, setAvatar,getAlluser} = require('../controlers/userControler');
const auth = require("../middleware/auth");
const router = express.Router();


// post user
router.post("/register",addUser)
router.get("/", auth, getUsers);
router.post('/login',loginUser)
router.post('/setAvatar/:id',setAvatar)
router.get('/allUsers/:id',getAlluser)
router.put('/change-password',changePassword)


module.exports = router