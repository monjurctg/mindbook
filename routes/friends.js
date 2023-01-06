const { match } = require("minimatch");
const { default: mongoose } = require("mongoose");
const { sendFriendReq } = require("../controlers/friendsControlers");
const FrinedsModel = require("../models/Friends");
const userModel = require("../models/user");

const router = require("express").Router();

router.post("/send-request", sendFriendReq);


router.get('/all-friends/:id',async(req,res)=>{
  const currentUserId=req.params.id
   const response = await userModel.aggregate([
    { "$lookup": {
      "from": FrinedsModel.collection.name,
      "let": { "friends": "$friends" },
      "pipeline": [
        { "$match": {
          "recipient": mongoose.Types.ObjectId(`${currentUserId}`),
          "$expr": { "$in": [ "$_id", "$$friends" ] }
        }},
        { "$project": { "status": 1 } }
      ],
      "as": "friends"
    }},
    { "$addFields": {
      "friendsStatus": {
        "$ifNull": [ { "$min": "$friends.status" }, 0 ]
      }
    }}
  ]).project("username email friends avatarImage friendsStatus")
  console.log(response,"res")
  
  res.send(response)
  
})

router.post("/accept-req", async(req, res) => {
  const UserA = req.body.requester;
  const UserB = req.body.recipient;
  console.log(UserA, UserB);
  const result1 = await FrinedsModel.findOneAndUpdate(
    { requester: UserA, recipient: UserB },
    { status: 3 },(err,docs)=>{
        if(err) return err
        return docs
    }
  ).clone();
  const result2 = await FrinedsModel.findOneAndUpdate(
    { recipient: UserA ,requester: UserB },
    { status: 3 },(err,docs)=>{
        if(err) return err
        return docs
    }
).clone()

if(result1.status==3 && result2.status==3){
    res.status(200).json({status:"success",message:"request accept successfully"})
}
});


module.exports = router;
