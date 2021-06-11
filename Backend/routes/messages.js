const schedule = require('node-schedule');

const router = require("express").Router();
const Message = require("../models/Message");
const user_auth = require("../Auth/user_auth");
const User = require('../models/User');
const Conversation = require("../models/Conversation");

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

router.post("/schedule_message",user_auth.verifyJwtToken, async (req, res) => {
  var token = user_auth.getTokenFromReq(req);
  var user_id = user_auth.getUserFromToken(token);
  var user = await User.findById(user_id);
  if(user.is_client){
    var message_info = req.body;
    try {
      for(var receiver_id of message_info.receiverIds){
        // getting conversation id of each receiver_id
        const old_conversation = await Conversation.findOne({
          members: { $all: [user_id, receiver_id] },
        });
  
        var conversation_id;
        if(old_conversation){
          conversation_id = old_conversation._id
        }
        else{
          const newConversation = new Conversation({
            members: [user_id, receiver_id],
          });
  
          const savedConversation = await newConversation.save();
          conversation_id = savedConversation._id
        }
        
        // Schedule Message
        const newMessage = new Message({
          "conversationId": conversation_id,
          "sender": user_id,
          "message_text": message_info.message_text
        });
  
        const job = schedule.scheduleJob(message_info.schedule_date_time_for_message, async ()=>{
          var saved_message = await newMessage.save()
        }); 
        
      }
      return res.status(200).json({
        "success": true,
        "message": "Message successfully scheduled"
      })
    } 
    catch (error) {
      return res.status(500).json(error);
    }
    
    
    
  }
  else{
    return res.status(500).json({
      "success": false,
      "message": "Only accessible to client"
    })
  }

  
});

module.exports = router;
