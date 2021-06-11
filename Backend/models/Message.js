mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const user = require('./User');

const MessageSchema = mongoose.Schema({
      conversationId: {
        type: String,
      },
      sender: {
        type: String,
      },
      message_text: {
        type: String,
      },
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);