const mongoose = require('mongoose');
const User = require('./User');
const Client = require('./Client');
const View = require('./View');
const Like = require('./Like');
const Tip = require('./Tip');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId, 
        ref: Client,
        required: true
    },
    caption: {
        type: String,
    },
    accessible_by_all: {
        type: Boolean,
        default: true,
        
    },
    accessibility: {
        type: String, 
        enum: ["all", "subscribed",'private_chat'] ,
        required: true,
        
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    no_of_views: {
        type: Number,
        default: 0
    },
    views_details: [{
        type: Schema.Types.ObjectId, 
        ref: View
    }],
    no_of_likes: {
        type: Number,
        default: 0
    },
    likes_details: [{
        type: Schema.Types.ObjectId, 
        ref: Like 
    }],
    total_tips_amount: {
        type: Number,
        default: 0
    },
    tips_details: [{
        type: Schema.Types.ObjectId, 
        ref: Tip,
        tip_amount: Number
    }],
    media: {
        type: String,
        
    },
    media_type: {
        type: String, 
        enum: ["video", "image",'audio','none'] ,
    },
    link: {
        type: String,
    },
    

})

module.exports = mongoose.model('Post',postSchema);