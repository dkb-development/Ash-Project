const mongoose = require('mongoose');
const Client = require('./Client');
const Post = require('./Post');
const User = require('./User');
const Schema = mongoose.Schema;

const tipSchema = new Schema({
    tip_post_id: {
        type: String
    },
    tip_content_by: {
        type: Schema.Types.ObjectId,
        ref: Client,
        required: true,
    },
    tip_by: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    tip_date: {
        type: Date,
        default: Date.now

    },
    tip_amount: {
        type: Number,
        required: true
    }

    

})

module.exports = mongoose.model('Tip',tipSchema);