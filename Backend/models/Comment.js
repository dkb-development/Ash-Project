const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        post_id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true,
        },
        comment_text: {
            type: String,
            required: true,
        },
        parent_comment_id: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Comment", CommentSchema);