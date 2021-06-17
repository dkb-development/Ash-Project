const router = require('express').Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const verify_token = require('../verify_token/user_verify_token');
const Post = require('../../models/Post');
const user_auth = require("../../Auth/user_auth");

// bcryptjs
const bcrypt = require('bcryptjs');
const { json } = require('express');

// router.route('/create_post')
//     .get((req,res)=>{res.json("Get Request on create post for client")})

//     .post()

const db_controller = require('../../models/DB_controllers/controller');
const Tip = require('../../models/Tip');
router.post('/create_post',user_auth.verifyJwtToken,(req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);
    var new_post = new Post({
        created_by: client_id,
        caption: req.body.caption,
        accessibility: req.body.accessibility,
        media: req.body.media,
        media_type: req.body.media_type,
        
    })
    if(req.body.accessibility != "all"){
        new_post.accessible_by_all = false;
        var tip_to_unlock = req.body.tip_to_unlock;
        if(tip_to_unlock > 0){
            new_post.is_tipped = true;
            new_post.tip_to_unlock = tip_to_unlock;
            new_post.accessibility = "tipped";
        }
        
    }
    new_post.save((err,success)=>{
        if(!err){
            res.status(200).json({
                "success": true,
                "msg": "Post Successfully Created"
            })
        }
        else{
            res.status(400).json({
                "error": err,
                "success": false
            })
        }
    })
    // res.json(client_id);
})

router.post('/delete_post',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        Post.deleteOne({
            "_id": req.body.post_id
        },(err,success)=>{
            if(err){
                return res.status(500).json(err);
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "deleted": true,
                    "message": "Post Successfully deleted"
                })
            }
        })
    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.get('/get_users',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var users = await User.find({
            _id: { $ne: client_id }
        });

        res_to_be_sent = [];
        for(let usr of users){
            usr.password = null;
            var user_with_tip_details = {};
            var tip_details = await Tip.find({
                tip_by: usr._id
            })
            var total_tip = 0;
            for(var tip_detail of tip_details){
                total_tip += tip_detail.tip_amount
            }
            user_with_tip_details = {
                "user": usr,
                "total_tip": total_tip
            };
            
            res_to_be_sent.push(user_with_tip_details)
        }
        
        return res.status(200).json(res_to_be_sent);

    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.get('/get_user_from_username/:username',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = User.findOne({
            username: req.params.username
        },(err,usr)=>{
            if(err){
                return res.status(500).json({
                    "success": false,
                    "Error": err
                });
            }
            else{
                usr.password = null
                return res.status(200).json(usr);
            }
        });

    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.get('/get_user_from_id/:id',user_auth.verifyJwtToken,async (req,res)=>{
    
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = User.findOne({
            _id: req.params.id
        },(err,usr)=>{
            if(err){
                return res.status(500).json({
                    "success": false,
                    "Error": err
                });
            }
            else{
                usr.password = null
                return res.status(200).json(usr);
            }
        });

    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.post('/restrict_user',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = await User.findById(req.body._id);

        if(!user.is_client){
            user.is_restricted = true;
        }

        await user.save((err,success)=>{
            if(err){
                return err;
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "is_restricted": true
                })
            }
        })
        
    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.post('/remove_restrict_user',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = await User.findById(req.body._id);

        if(!user.is_client){
            user.is_restricted = false;
        }

        await user.save((err,success)=>{
            if(err){
                return err;
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "is_restricted": false
                })
            }
        })
        
    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})


router.post('/block_user',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = await User.findById(req.body._id);

        if(!user.is_client){
            user.is_blocked = true;
        }

        await user.save((err,success)=>{
            if(err){
                return err;
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "is_blocked": true
                })
            }
        })
        
    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})

router.post('/unblock_user',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var user = await User.findById(req.body._id);

        if(!user.is_client){
            user.is_blocked = false;
        }

        await user.save((err,success)=>{
            if(err){
                return err;
            }
            else{
                return res.status(200).json({
                    "success": true,
                    "is_blocked": false
                })
            }
        })
        
    }
    else{
        return res.status(500).json(
            {
                "success": false,
                "message": "Only accessible to client"
            }
        )
    }
})



// getUserFromToken = (token)=>{
//     return jwt.decode(token)['_id'];

// }
// router.use("/user",verify_token,post_routes);

module.exports = router;