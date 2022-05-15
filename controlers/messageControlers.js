
const { from } = require("responselike");
const Massage = require("../models/messages");

async function addMessage (req,res){
    console.log("hitting",req.body)
    try{
        const {from,to,message} = req.body
        const data = await Massage.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })
        if(data) return res.json({status:"ok",message:"Message added succecsfully in database"});
        return res.status(500).json({status:"error",message:"Faild to add to the database"})

    }catch(err){
        return res.status(500).json({status:"error",message:err})

    }


}



async function getAllMsg(req,res){

    
    try{
        const {from,to} = req.body
        const messages = await Massage.find({
            users:{$all:[from,to]},
        }).sort({updateAt:1});
       
     
        const projectMessage = messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString()===from,
                message:msg.message.text
            }

        })
        console.log(projectMessage,"messages")
        res.json(projectMessage)

    }catch(err){
        console.log("message",err)
        res.status(500).json({status:"error",error:err})
        
    }


}
module.exports = {
    addMessage,getAllMsg

}



