const mongoose = require('mongoose');
const Client = require('./Client');
const Post = require('./Post');
const User = require('./User');
const Schema = mongoose.Schema;

const viewSchema = new Schema({
    viewed_post_id: {
        type: String
    },
    viewed_content_creator: {
        type: Schema.Types.ObjectId,
        ref: Client,
        required: true,
    },
    viewed_by: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    viewed_date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('View',viewSchema);