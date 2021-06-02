const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentLikeSchema = new Schema({
    liked_comment_id: {
        type: String,
        required: true
    },
    liked_by: {
        type: String,
        required: true,
    },
},
{ timestamps: true })

module.exports = mongoose.model('CommentLike',commentLikeSchema);