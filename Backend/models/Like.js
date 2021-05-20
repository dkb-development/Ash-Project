const mongoose = require('mongoose');
const Client = require('./Client');
const Post = require('./Post');
const User = require('./User');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liked_post_id: {
        type: String,
        required: true
    },
    liked_content_creator: {
        type: String,
        required: true,
    },
    liked_by: {
        type: String,
        required: true,
    },
    liked_date: {
        type: Date,
        default: Date.now
    }

    

})

module.exports = mongoose.model('Like',likeSchema);