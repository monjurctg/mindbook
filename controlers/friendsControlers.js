const User = require("../models/user");
const FrinedsModel = require("../models/Friends")


const sendFriendReq = async(req,res)=>{
    const userA=req.body.requester
    const userB = req.body.recipient

    const docA = await FrinedsModel.findOneAndUpdate(
        { requester: userA, recipient: userB },
        { $set: { status: 1 }},
        { upsert: true, new: true }
    )
    const docB = await FrinedsModel.findOneAndUpdate(
        { recipient: userA, requester: userB },
        { $set: { status: 2 }},
        { upsert: true, new: true }
    )

    const updateUserA = await User.findOneAndUpdate(
        { _id: userA },
        { $push: { friends: docA }}
    )
    const updateUserB = await User.findOneAndUpdate(
        { _id: userB },
        { $push: { friends: docB }}
    )

}


module.exports={
    sendFriendReq
}