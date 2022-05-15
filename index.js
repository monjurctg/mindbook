const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { addUser } = require("./controlers/userControler");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messagesRoute");

// const expressServer = http.createServer(app);
const socket = require("socket.io");
// const { Socket } = require("dgram");
// const { message } = require("statuses");
// const { JWT_SECRET } = require("./controlers/variables");


// const io = new Server(expressServer);

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || `http://localhost:3000`;





// parse requests of content-type - application/json
app.use(express.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

// const uri = "mongodb+srv://chatApp:monjur123@cluster0.pvcyw.mongodb.net/Chat-App?retryWrites=true&w=majority";
const uri = 'mongodb://localhost:27017/myapp'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
app.get("/", (req, res) => {

  res.sendFile(__dirname + "/index.html");
});
// route setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// set port, listen for requests

const server = app.listen(PORT, () => {

  console.log(`Server is running on. http://localhost:${PORT}`);
});



const io = socket(server,{
  cors:{
    origin:ORIGIN,
    Credential:true
  }
})
// console.log(io,"io")
global.onlineUsers = new Map()

io.on('connection',(socket)=>{
  global.chatSchoket = socket
  socket.on('add-user',(userId)=>{
    onlineUsers.set(userId,socket.id)
  });
  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to)
    if(sendUserSocket){
      socket.to(sendUserSocket).emit('msg-recive',data.msg)
    }
  })
})