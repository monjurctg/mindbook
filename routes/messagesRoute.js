const express = require("express");
const { addMessage, getAllMsg } = require("../controlers/messageControlers");

const router = express.Router();

// post user
router.post("/addMsg",addMessage)

router.post('/getMsg',getAllMsg)



module.exports = router