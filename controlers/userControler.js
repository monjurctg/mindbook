const User = require("../models/user");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./variables");


// add a user

async function addUser(req, res, next) {
  // console.log(req.body);
  const {username,email,password}= req.body
  if(!username || typeof username !=="string"){
    return res.json({status:"error",message:"username is empty "})

  }
  if(!email || typeof email !=="string"){
    return res.json({status:"error",message:"email is empty"})
  }

  if(!password || typeof password !=="string"){
    return res.json({status:"error",message:"password is required"})
  }
  if(password.length<5 || typeof password !=="string"){
    return res.json({status:"error",message:"password length should be greather then 5 "})
  }
 
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    ...req.body,
    password:hashedPassword
  });
  // handle error
  
  // save new user

  try {
    const result = await newUser.save();
     result.password=""
    
    res.status(200).json({
        status:"sucess",
      message: "user add successfully",
      user:result
   
    });
  } catch (err) {
    if(err.code ===11000){
      return res.status(500).json({status:"error",errors:"duplicate ",message:"username or email already exist"})
    }

    
    res.status(500).json({
      errors: `user not save ${err}`,
    });
  }
}

async function getUsers(req, res)  {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    res.send(500).json({ message: "server error" });
  }
}
// login function
async function loginUser(req,res,next){
  const {username,password}=req.body
  // console.log(username)
  const user = await User.findOne({username})
  // delete user.password
  // console.log(user)
  if(!user){
    return res.status(500).json({status:"error",message:"inviled username or password"})
  }
  if(await bcrypt.compare(password,user.password)){
    const token = jwt.sign({
      id:user._id,
      username:username
    },`${JWT_SECRET}`)

user.password=""
    return res.status(200).json({status:"ok",token:token,user})
  }
  else{
    return res.status(500).json({status:"error",error:"inviled username or password"})
  }
 
}

async function setAvatar(req,res){

  try{

    const userId = req.params.id
    // console.log("api hitting setAvatar",userId)
    const avatarImage = req.body.image
    const userData = await User.findByIdAndUpdate(userId,{
      isAvatarImage:true,
      avatarImage
    })
    return res.status(200).json({
      isSet:userData.isAvatarImage,image:userData.avatarImage
    })
  }catch(err){
    return res.status(500).json(err)

  }
}
async function getAlluser(req,res){

  try{
    const users = await User.find({_id:{  $ne:req.params.id}}).select([
      "email","username","avatarImage","_id"
    ])
    // console.log("req",users)

    return res.json({users})

  }catch(err){
    return res.status(500).json({msg:"somting wrong"})

  }
}
async function changePassword(req,res,next){
  const {token,password} = req.body
  try{
    const user = await jwt.verify(token,`${JWT_SECRET}`)
    const newHashPassword = await bcrypt.hash(password,10)
    const {_id}=user.id
    await User.updateOne({_id},{$set:{password:newHashPassword}})
    res.send({user,password,newHashPassword})

  }catch(err){
    console.log(err)

  }
}
module.exports = {
  addUser,
  loginUser,
  changePassword,
  getUsers,
  setAvatar,
  getAlluser
};