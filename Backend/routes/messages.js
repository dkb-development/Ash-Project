const router = require("express").Router();
const Message = require("../models/Message");
const user_auth = require("../Auth/user_auth");

//add

router.post("/",user_auth.verifyJwtToken, async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/get_messages_for_converation/:conversationId",user_auth.verifyJwtToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
