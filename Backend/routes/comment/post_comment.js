const router = require('express').Router();
const user_auth = require('../../Auth/user_auth');
const Comment = require('../../models/Comment');
const CommentLike = require('../../models/Comment_like');
const User = require('../../models/User');

// DB Controller
const getUserDetails = require('../../models/DB_controllers/controller').getUserDetails;
const getPosts = require('../../models/DB_controllers/controller').getPosts;
const isTipEnough = require('../../models/DB_controllers/controller').isTipEnough;
const passport = require('passport');
const Like = require('../../models/Like');

router.post('/make_comment',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    if(user_id == req.body.user_id){
        var new_comment = new Comment(req.body);
        try{
            var comment = await new_comment.save();
            var comment_user = await User.findById(comment.user_id);
            var is_liked_by_user = false;
            var user_profile_picture = null;
            if(comment_user.profile_picture != null){
                user_profile_picture = comment_user.profile_picture;
            }
            var this_comment = {
                "comment_id": comment._id,
                "post_id": comment.post_id,
                "user_id": comment.user_id,
                "username": comment_user.username,
                "user_profile_picture": user_profile_picture,
                "comment_text": comment.comment_text,
                "parent_comment_id": comment.parent_comment_id,
                "updatedAt": comment.updatedAt,
                "comment_likes_count": 0,
                "is_liked_by_user": is_liked_by_user
            }
            return res.status(200).json(this_comment);
        }
        catch(err){
            return res.status(500).json({
                "success": false,
                "Error": err
            })
        }
        
    }
    else{
        return res.status(500).json({
            "success": false,
            "Error": "Token doesn't match"
        })
    }
})
router.post('/get_comments_for_post',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    if(user_id == req.body.user_id){
        var post_id = req.body.post_id;
        if(post_id){
            try{
                var comments = await Comment.find({
                    "post_id": post_id
                }).sort({date_created: -1}).exec();

                var comments_info = [];
                for(var comment of comments){
                    // Count Likes of the comment
                    var comment_likes = await CommentLike.find({
                        "liked_comment_id": comment._id
                    })
                    var likes_count = comment_likes.length;
                    var is_liked_by_user = false;
                    if(likes_count > 0){
                        for(let comment_like of comment_likes){
                            if(comment_like.liked_by == user_id){
                                is_liked_by_user = true;
                                break;
                            }
                        }
                    }
                    
                    var comment_user = await User.findById(comment.user_id);
                    var user_profile_picture = null;
                    if(comment_user.profile_picture != null){
                        user_profile_picture = comment_user.profile_picture ;
                    }
                    var this_comment = {
                        "comment_id": comment._id,
                        "post_id": comment.post_id,
                        "user_id": comment_user._id,
                        "username": comment_user.username,
                        "user_profile_picture": user_profile_picture,
                        "comment_text": comment.comment_text,
                        "parent_comment_id": comment.parent_comment_id,
                        "updatedAt": comment.updatedAt,
                        "comment_likes_count": likes_count,
                        "is_liked_by_user": is_liked_by_user
                    }
                    comments_info.push(this_comment);
                }
                
                return res.status(200).json(comments_info);
            }
            catch(err){
                return res.status(500).json({
                    "success": false,
                    "Error": "Token doesn't match"
                })
            }
            
        }
        else{
            return res.status(500).json({
                "success": false,
                "Error": "Post not Found"
            })
        }
    }
})
router.post('/like_dislike_comment',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    
    if(user_id == req.body.user_id){

        var comment_like_info = await CommentLike.findOne({
            "liked_comment_id": req.body.comment_id,
            "liked_by": req.body.user_id
        });
        // Dislike Comment
        if(comment_like_info){
            CommentLike.deleteOne({
                "liked_comment_id": req.body.comment_id,
                "liked_by": req.body.user_id
            },(err,success)=>{
                if(err){
                    return res.status(500).json(err);
                }
                else{
                    return res.status(200).json({
                        "is_liked": false,
                        "success": true
                    })
                }
            })
        }
        // Like Comment
        else{
            var new_comment_like = new CommentLike({
                "liked_comment_id": req.body.comment_id,
                "liked_by": req.body.user_id
            });
            new_comment_like.save((err,success)=>{
                if(err){
                    return res.status(500).json(err);
                }
                else{
                    return res.status(200).json({
                        "is_liked": true,
                        "success": true
                    })
                }
            })
        }
    }
    else{
        return res.status(500).json("JWT Token doesn't match");
    }
})
router.post('/delete_comment',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);

    if(user_id == req.body.user_id){
        try {
            var comment_info = await Comment.findById(req.body.comment_id);
            if(comment_info){
                if(comment_info.user_id == user_id){
                    Comment.deleteOne({
                        "_id": comment_info._id
                    },(err,success)=>{
                        if(err){
                            return res.status(500).json(err);
                        }
                        else{
                            return res.status(200).json({
                                "success": true,
                                "deleted": true,
                                "message": "Comment Successfully deleted"
                            })
                        }
                    })
                }
            }
            else{
                return res.status(500).json("No Comment Found");
            }
        } catch (error) {
            return res.status(500).json(error);
            
        }
    }
    else{
        return res.status(500).json("JWT Token doesn't match");
    }
})

module.exports = router;