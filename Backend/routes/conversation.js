const router = require("express").Router();
const Conversation = require("../models/Conversation");
const user_auth = require("../Auth/user_auth");

//new conv
router.post("/create_conversation",user_auth.verifyJwtToken, async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const old_conversation = await Conversation.findOne(
      {
        members: { $all: [req.body.senderId, req.body.receiverId] },
      }
    )
    if(old_conversation){
      return res.status(200).json(old_conversation);
    }
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);    
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/get_conversation/:userId",user_auth.verifyJwtToken, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    if(conversation){
      return res.status(200).json(conversation);
    }
    else{
      console.log("No conversation");
    }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId
router.get("/get_conversation/:firstUserId/:secondUserId",user_auth.verifyJwtToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if(conversation){
      return res.status(200).json(conversation);
    }
    else{
      return res.status(200).json({
        "conversation": null
      })
    }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
