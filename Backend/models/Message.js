mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./User');

const messageSchema = mongoose.Schema({
    messageText: {
        type: String
        },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    type: {
        type: String,
        default: "text"
    },
    chatMediaUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = { Message }