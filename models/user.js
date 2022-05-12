const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAvatarImage:{
        type:Boolean,
        default:false
    },
    avatarImage:{
        type:String,
        default:""
    }
    // gender: {
    //     type: String,
    //     required:true
    // },
})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel

