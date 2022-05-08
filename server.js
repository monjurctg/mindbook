const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { addUser } = require('./controlers/userControler');
const userRouter = require('./routes/userRoutes')

// parse requests of content-type - application/json
app.use(express.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

mongoose
  .connect("mongodb://localhost:27017/myapp", {
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
  res.send(`
      <h1 style = "text-align: center; color:green">Server Run successfully</h1>
      `);
});
// route setup
app.use('/users',userRouter)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
