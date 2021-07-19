const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const user_auth = require('../../Auth/user_auth');
const Post = require('../../models/Post');
const Tip = require('../../models/Tip');
const Client = require('../../models/Client');

// DB Controller
const getUserDetails = require('../../models/DB_controllers/controller').getUserDetails;
const getPosts = require('../../models/DB_controllers/controller').getPosts;
const isTipEnough = require('../../models/DB_controllers/controller').isTipEnough;
const passport = require('passport');
const Like = require('../../models/Like');


router.get('/posts',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    var posts = [];
    var result_to_be_sent = {};
    var client,user;

    // User Details
    await getUserDetails(user_id)
        .then((usr)=>{
            user = usr;
        })
        .catch((err)=>{
            res.send(err);
            console.log(err);
        });
    

    // Get Posts
    // var ite;
    // await getPosts()
    //     .then((psts)=>{
    //         // Assigning appropriate media
    //         psts.forEach((post)=>{
    //             var post_details = {};
    //             if(!user.is_subscribed){
    //                 // Unsubscribed User
    //                 post.media = post.accessible_by_all?post.media:null;
    //                 if(post.is_tipped){
    //                     console.log("Tipped Post ");
    //                     Tip.find(
    //                         {tip_post_id: post_details.post_info._id,tip_by: user._id},(err,tip_details)=>{
    //                             if(err){
    //                                 console.log("Error : ",err);
    //                             }
    //                             else{
    //                                 console.log("Success");
    //                                 if(tip_details.tip_amount >= post_details.post_info.tip_to_onlock){
    //                                     post_details.isTipEnough = true;
    //                                 }
    //                                 else{
    //                                     post_details.isTipEnough = false;
    //                                     console.log("Tip Details");
    //                                 }
    //                             }
    //                         })
    //                 }
    //             }
                
    //             post_details.post_info = post;
    //             posts.push(post_details);
                
    //         })
    //     })
    //     .catch((err)=>{
    //         console.log("Error : ",err);
    //         res.status(400).json({"Error": err});
    //     })

    // Updating Post Likes Count
    var psts = await Post.find({}).sort({date_created: -1}).exec();
    for(var post of psts){
        try {
            var like_entries = await Like.find({
                "liked_post_id": post._id
            });
            post.no_of_likes = like_entries.length;
            try {
                await post.save();
            } catch (error) {
                return res.status(500).json(error);
            }

        } catch (error) {
            return res.status(500).json(error);
        }
        
    }
    
    if(!user.is_client){
        for(var post of psts) {
            // console.log("User ",user);
            post_details = {};

            // Like Info
            var like_info;
            like_info = await Like.findOne({liked_post_id: post._id,liked_by: user_id});
            if(like_info){
                post_details.is_liked = true;
            }
            else{
                post_details.is_liked = false;
            }


            if(!user.is_subscribed){
                post.media = post.accessible_by_all?post.media:null;
            }
            else{
                if(post.is_tipped){
                    var tip_details = await Tip.findOne({tip_post_id: post._id,tip_by: user._id}).exec();
                    if(tip_details){
                        if(tip_details.tip_amount >= post.tip_to_unlock){
                            console.log("Tip is enough");
                        }
                        else{
                            console.log("tip_details.tip_amount < post.tip_to_unlock");
                            post.media = null;
                            post_details.isTipEnough = false;
                        }   
                    }
                    else{
                        // console.log("Tip Find Else Block");
                        post.media = null;
                        post_details.isTipEnough = false;
                    }
                }
            }
    
            
            post_details.post_info = post;
            posts.push(post_details);
            
            // console.log("Post : ",post);
            // console.log("Tip Details : ",tip_details);
            
        }
    }
    else{
        for(var post of psts){
            post_details = {};
            post_details.post_info = post;
            posts.push(post_details);
        }
    }
    
    
    // Getting Client Username
    client = await User.findOne({
        "is_client": true
    }).exec();

    // Getting client Subscriber Count
    var no_of_subscribers = 0;
    var usrs = await User.find({}).exec();
    for(var usr of usrs){
        if(usr.is_subscribed){
            no_of_subscribers += 1;
        }
    }

    
    for(var post_details of posts){
        post_details.client_username = client.username;
        post_details.client_subscriber_count = no_of_subscribers - 1; // " -1 " is for client itself
        post_details.user_is_subscribed = user.is_subscribed;
        post_details.user_id = user._id;
        post_details.client_id = client._id;
    }

    // console.log("Posts : ",posts);
    return res.status(200).json(posts);

    // Post.find({}).sort({date_created: -1}).exec((err,psts)=>{
    //     if(err){
    //         console.log("Error : ",err);
    //     }
    //     else{
    //         console.log("Inside Post find else");
    //         psts.forEach(async (post)=>{
    //             post_details={};
    //             if(!user.is_subscribed){
    //                 // Unsubscribed User
    //                 post.media = post.accessible_by_all?post.media:null;
    //             }
    //             else{
    //                 console.log("Inside Post forEach");
    //                 // Subscribed User
    //                 if(post.is_tipped){
    //                     Tip.find({tip_post_id:post._id,tip_by: user._id},(err,tip_details)=>{
    //                         if(err){
    //                             post.media = null;
    //                         }
    //                         else{
    //                             console.log("Inside Tip Find");
    //                             if(tip_details.tip_amount >= post.tip_to_unlock){
    //                                 pass;
    //                             }
    //                             else{
    //                                 post.media = null;
    //                                 post_details.isTipEnough = false;
    //                                 console.log("Tip not enough for post : ",post);
    //                             }
    //                         }
    //                     })
    //                 }
    //             }
    //             console.log("Pushing Individual Post");
    //             post_details.post_info = post;
    //             posts.push(post_details);
    //         })
    //         console.log("Sending back response");
    //         console.log("Posts : ",posts);
    //         return res.status(200).json(posts);
    //     }
    // })




    // posts.forEach((post_details)=>{
    //     if(post_details.post_info.is_tipped){
    //         // ite = await isTipEnough(post_details.post_info._id,user._id,post_details.post_info.tip_to_unlock);
    //         Tip.find(
    //             {
    //                 tip_post_id: post_details.post_info._id,
    //                 tip_by: user._id
    //             }
    //         ).then((tip_details)=>{
    //             if(tip_details.tip_amount >= post_details.post_info.tip_to_unlock){
    //                 console.log("tip_details.tip_amount >= tip_to_onlock")
    //                 // res = true;
    //                 // return true;
    //             }
    //             else{
    //                 console.log("tip_details.tip_amount < tip_to_onlock")
    //                 // res = true;
    //                 // res = false;
    //                 // return false;
    //                 post_details.post_info.media = null;
    //                 post_details.isTipEnough = false;
    //             }
    //         }).catch((err)=>{
    //             console.log("Error : ",err);
    //             // return false;
    //             post_details.post_info.media = null;
                
    //         })
    //         if(!ite){   
    //             post_details.post_info.media = null;
    //             console.log("Is Tip Enough : ",ite);
    //         }
            
    //     }
    //     // console.log(post_details);
    // })
        // if(post.is_tipped){
        //     ite = isTipEnough(post._id,user._id,post.tip_to_unlock).then((res)=>{return res;});
        //     post.media = ite?post.media:null;
        //     post_details.is_tip_enough = ite;
        //     console.log("Is Tip Enough : ",ite);
            
        // }
    console.log("User : ",user);
    // console.log("Posts Outside: ",posts)
    // console.log("ITE : ",ite);
    return;

    // User.findById(user_id,(err,usr)=>{
    //                 if(err){
    //                     res.status(400).json(err);
    //                 }
    //                 else{
    //                     //    Sort posts according to date
    //                     Post.find({}).sort({date_created: -1}).exec((err,psts)=>{
    //                         if(err){
    //                             res.status(400).json(err);
    //                         }
    //                         else{
    //                             var post_details = {};
    //                             // console.log(getUserDetails(psts[0].created_by),typeof(getUserDetails(psts[0].created_by)));
    //                             getUserDetails(psts[0].created_by).exec((err,doc)=>{
    //                                 if(err){
    //                                     console.log("Error: ",err);
                                    
    //                                 }
    //                                 else{
    //                                     console.log(doc);
    //                                 }
    //                             })
    //                             return res.json("Success");
    //                             // Finding Client Username
    //                             // User.findById(psts[0].created_by,(err,client)=>{
    //                             //     if(err){
    //                             //         post_details.post_creator_username = "username";
    //                             //     }
    //                             //     else{
    //                             //         if(client){
    //                             //             psts.forEach((post)=>{
    //                             //                 post_details.post_creator_username = client.username;
    //                             //                 console.log("Username : ",post_details.post_creator_username);
            
    //                             //                 // If user is not subscribed
    //                             //                 if(!usr.is_subscribed){
    //                             //                     post.media = post.accessible_by_all?post.media:null;
    //                             //                 }
    //                             //                 if(post.is_tipped){
    //                             //                     // console.log(post.caption,"tipped post");
    //                             //                     post_details.is_tip_not_enough = true;
    //                             //                     // Tip.find({
    //                             //                     //     tip_post_id: post._id,
    //                             //                     //     tip_by: User._id
    //                             //                     // },(err,tip_details)=>{
    //                             //                     //     if(err){
    //                             //                     //         post.media = null;
    //                             //                     //         post.is_tip_not_enough = true;
    //                             //                     //         console.log(err);
    //                             //                     //     }
    //                             //                     //     else{
    //                             //                     //         // Tip amount not enough to unlock
    //                             //                     //         if(tip_details.tip_amount < post.tip_to_unlock){
    //                             //                     //             post.media = null;
    //                             //                     //             post.is_tip_not_enough = true;
    //                             //                     //         }
    //                             //                     //     }
    //                             //                     // })
    //                             //                 }
    //                             //                 post_details.post_info = post;
    //                             //                 posts.push(post_details);

    //                             //                  // console.log(posts);
    //                             //                 result_to_be_sent.posts = posts;
    //                             //                 res.status(200).json(result_to_be_sent);
    //                             //             })
    //                             //         }
    //                             //     }
    //                             // })
                                
                               

    //                         }
    //                     })
    //                     // return usr;
    //                 }
    //             })
});
router.get('/posts_no_auth',async (req,res
    )=>{
    var posts = [];
    var psts = await Post.find({}).sort({date_created: -1}).exec();

    // Getting Client Username
    var client = await User.findOne({
        "is_client": true
    }).exec();

    // Getting client Subscriber Count
    var no_of_subscribers = 0;
    var usrs = await User.find({}).exec();
    for(var usr of usrs){
        if(usr.is_subscribed){
            no_of_subscribers += 1;
        }
    }

    // for(var post_details of posts){
    //     post_details.client_username = client.username;
    //     post_details.client_subscriber_count = no_of_subscribers - 1; // " -1 " is for client itself
    //     post_details.user_is_subscribed = user.is_subscribed;
    // }

    psts.forEach((post)=>{
        post_details = {};
        post.media = null;
        post_details.post_info = post;
        post_details.client_username = client.username;
        post_details.client_subscriber_count = no_of_subscribers - 1; // " -1 " is for client itself
        posts.push(post_details);
    })

    return res.status(200).json(posts);
});
router.post('/pay_to_unlock',user_auth.verifyJwtToken,(req,res
    )=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);

    // console.log(req.body.post_id);
    // console.log(req.body.user_id);
    // console.log(req.body.client_id);
    // console.log(req.body.tip_amount);
    if(user_id == req.body.user_id){
        var new_tip = new Tip({
            tip_post_id : req.body.post_id,
            tip_content_creator : req.body.client_id,
            tip_by : req.body.user_id,
            tip_amount : req.body.tip_amount
        })

        new_tip.save((err,success)=>{
            if(err){
                return res.status(400).json({
                    "error": err,
                    "success": false
                })
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "msg": "Payment Successfully Done and Post is Unlocked now"
                })
            }
        })
    }
    

    // return res.status(200).json("Success");
});
router.post('/pay_tip_to_post',user_auth.verifyJwtToken,(req,res
    )=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);

    var new_tip = new Tip({
        tip_post_id : req.body.post_id,
        tip_content_creator : req.body.client_id,
        tip_by : req.body.user_id,
        tip_amount : req.body.tip_amount
    })

    new_tip.save((err,success)=>{
        if(err){
            return res.status(400).json({
                "error": err,
                "success": false
            })
        }
        else{
            return res.status(200).json({
                "success": true,
                "msg": "Payment Successfully Done Thank You for the Tip"
            })
        }
    })
    

    // return res.status(200).json("Success");
});
router.post('/pay_tip_to_client',user_auth.verifyJwtToken,(req,res
    )=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);

    var new_tip = new Tip({
        tip_post_id : "null",
        tip_content_creator : req.body.client_id,
        tip_by : req.body.user_id,
        tip_amount : req.body.tip_amount
    })

    new_tip.save((err,success)=>{
        if(err){
            return res.status(400).json({
                "error": err,
                "success": false
            })
        }
        else{
            return res.status(200).json({
                "success": true,
                "msg": "Payment Successfully Done Thank You for the Tip"
            })
        }
    })
    

    // return res.status(200).json("Success");
});
router.post('/like_or_dislike_post',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    var user;
    console.log()
    if(user_id == req.body.user_id){
        user = await User.findById(req.body.user_id);
        // Preventing client from liking its own content
        if(user.is_client){
            return res.status(500).json("Client can't like it's own content");
        }
        else{
            var like_info = await Like.findOne({liked_post_id: req.body.post_info._id,liked_by: user_id});
            var post = await Post.findById(req.body.post_info._id);
            if(like_info){
                console.log(like_info);
                // Dislike the Post
                Like.deleteOne({liked_post_id: req.body.post_info._id,liked_by: user_id},(err,success)=>{
                    if(err){
                        return res.status(400).json(err);
                    }
                    else{
                        
                        post.no_of_likes -= 1;
                        post.save((err,success)=>{
                            if(err){
                                return res.status(400).json(err);
                            }
                            else{
                                return res.status(200).json({
                                    "is_liked": false,
                                    "success": true
                                })
                            }
                        });
                        
                    }
                })
            }
            else{
                console.log("No info");
                // Like the Post
                var new_like = new Like({
                    liked_post_id : req.body.post_info._id,
                    liked_content_creator : req.body.client_id,
                    liked_by : req.body.user_id
                })
                 new_like.save((err,success)=>{
                     if(err){
                         return res.status(400).json(err);
                     }
                     else{
                        post.no_of_likes += 1;
                        post.save((err,success)=>{
                            if(err){
                                return res.status(400).json(err);
                            }
                            else{
                                return res.status(200).json({
                                    "is_liked": true,
                                    "success": true
                                })
                            }
                        })
                    }
                 });
            }
        }
    }
    // user = User.findById(user_id)
    else{
        console.log("USer Id doesn't match");
        return res.status(500).json("User ID incorrect");
    }
    
})
router.get('/get_subscription_fee',user_auth.verifyJwtToken,(req,res)=>{
    return res.status(200).json({
        "subscription_fee_per_month" : process.env.subscription_fee_per_month
    })
})
router.post('/pay_to_subscribe',user_auth.verifyJwtToken,async (req,res)=>{
    console.log(req);
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);
    var user = await User.findById(user_id);
    
    if(user){
        user.is_subscribed = true;
        user.save((err,success)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(success)
                return res.status(200).json({
                    "success": true,
                    "subscribed": true
                })
            }
        });
        
    }
    else{
        res.status(400).json({
            "success": false,
            "subscribed": false
        })
    }
    // user = User.findById(user_id)
})
router.post('/get_liked_posts',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var user_id = user_auth.getUserFromToken(token);

    // console.log(req.body.post_id);
    // console.log(req.body.user_id);
    // console.log(req.body.client_id);
    // console.log(req.body.tip_amount);
    if(user_id == req.body.user_id){
        try {
            var user = await User.findById(user_id);
        } catch (error) {
            return res.status(500).json({
                "Error": error
            })
        }
        if(user.is_client){
            return res.status(500).json({
                "Error": "Only accessible to users not client"
            }) 
        }   
        else{
            try {
                var liked_posts = await Like.find({
                    "liked_by": user._id
                }).sort({updatedAt: -1}).exec();
                var posts = [];
                for(let liked_post of liked_posts){
                    try {
                        var temp_post = await Post.findById(liked_post.liked_post_id);
                        
                    } catch (error) {
                        return res.status(500).json({
                            "Error": error
                        }) 
                    }
                    posts.push(temp_post);
                    
                }
                // Updating Post Likes Count
                var psts = await Post.find({}).sort({date_created: -1}).exec();
                for(var post of psts){
                    try {
                        var like_entries = await Like.find({
                            "liked_post_id": post._id
                        });
                        post.no_of_likes = like_entries.length;
                        try {
                            await post.save();
                        } catch (error) {
                            return res.status(500).json(error);
                        }

                    } catch (error) {
                        return res.status(500).json(error);
                    }
                }

                
                // Getting Client Username
                var client = await User.findOne({
                    "is_client": true
                }).exec();

                // Getting client Subscriber Count
                var no_of_subscribers = 0;
                var usrs = await User.find({}).exec();
                for(var usr of usrs){
                    if(usr.is_subscribed){
                        no_of_subscribers += 1;
                    }
                }

                var posts_with_details = [];
                for(let post of posts){
                    var post_details = {};
                    post_details.client_username = client.username;
                    post_details.client_subscriber_count = no_of_subscribers - 1; // " -1 " is for client itself
                    post_details.user_is_subscribed = user.is_subscribed;
                    post_details.user_id = user._id;
                    post_details.client_id = client._id;
                    post_details.is_liked = true;
                    post_details.post_info = post;
                    // Post Tip Details
                    if(post != null && post.is_tipped){
                        var tip_details = await Tip.findOne({tip_post_id: post._id,tip_by: user._id}).exec();
                        if(tip_details){
                            if(tip_details.tip_amount >= post.tip_to_unlock){
                                console.log("Tip is enough");
                            }
                            else{
                                console.log("tip_details.tip_amount < post.tip_to_unlock");
                                post.media = null;
                                post_details.isTipEnough = false;
                            }   
                        }
                        else{
                            // console.log("Tip Find Else Block");
                            post.media = null;
                            post_details.isTipEnough = false;
                        }
                    }
                    if(post != null){
                        posts_with_details.push(post_details);

                    }

                }

                return res.status(200).json(posts_with_details);
            } catch (error) {
                return res.status(500).json({
                    "Error": error
                }) 
            }
            
        }
        
    }
    else{
        return res.status(500).json({
            "Error": "JWT Token doesn't match"
        })
    }
    

    // return res.status(200).json("Success");
});


module.exports = router;