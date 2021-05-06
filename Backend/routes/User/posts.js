const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const user_auth = require('../../Auth/user_auth');
const Post = require('../../models/Post');

router.get('/posts',user_auth.verifyJwtToken,(req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    var posts = [];
    User.findById(user_id,(err,usr)=>{
                    if(err){
                        res.status(400).json(err);
                    }
                    else{
                        Post.find({},(err,psts)=>{
                            if(err){
                                res.status(400).json(err);
                            }
                            else{
                                psts.forEach((post)=>{
                                    if(!usr.is_subscribed){
                                        post.media = post.accessible_by_all?post.media:null;
                                    }
                                    posts.push(post);
                                })
                                console.log(posts);
                                res.status(200).json(posts);

                            }
                        })
                        // return usr;
                    }
                })
    // const token = req.header('auth_token');
    // const token_verified = await jwt.verify(token,process.env.TOKEN_SECRET);
    // const user = await User.findOne({_id:token_verified._id});
    // res.json({
    //     'Username' : user.username,
    //     'post': {
    //         'title' : "private post",
    //         'content' : "only accessed by logged in users",
            
    //     }
    // })
    // res.json(["Hello","World","from","Backend"])
});
module.exports = router;