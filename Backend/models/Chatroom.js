mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = require('./User');
const Message = require('./Message');

const messageSchema = mongoose.Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = { Chat }