const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { addUser } = require("./controlers/userControler");
const userRouter = require("./routes/userRoutes");
const http = require("http");
const path = require("path");
const expressServer = http.createServer(app);
const { Server } = require("socket.io");
const { Socket } = require("dgram");
const { message } = require("statuses");
const { JWT_SECRET } = require("./controlers/variables");


const io = new Server(expressServer);

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;





// parse requests of content-type - application/json
app.use(express.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

const uri = "mongodb+srv://chatApp:monjur123@cluster0.pvcyw.mongodb.net/Chat-App?retryWrites=true&w=majority";

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

// set port, listen for requests

expressServer.listen(PORT, () => {
  console.log(JWT_SECRET)
  console.log(`Server is running on. http://localhost:${PORT}`);
});
