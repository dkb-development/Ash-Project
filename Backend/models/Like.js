const mongoose = require('mongoose');
const Client = require('./Client');
const Post = require('./Post');
const User = require('./User');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liked_post_id: {
        type: String
    },
    liked_content_by: {
        type: Schema.Types.ObjectId,
        ref: Client,
        required: true,
    },
    liked_by: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    liked_date: {
        type: Date,
        default: Date.now
    }

    

})

module.exports = mongoose.model('Like',likeSchema);