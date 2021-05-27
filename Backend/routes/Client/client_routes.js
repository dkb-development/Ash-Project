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

router.get('/get_users',user_auth.verifyJwtToken,async (req,res)=>{
    var token = user_auth.getTokenFromReq(req);
    var client_id = user_auth.getUserFromToken(token);

    var client = await User.findById(client_id);
    if(client._id == client_id){
        var users = User.find({
            _id: { $ne: client_id }
        },(err,usrs)=>{
            if(err){
                return res.status(500).json({
                    "success": false,
                    "Error": err
                });
            }
            else{
                usrs.forEach((usr)=>{
                    usr.password = null
                })
                return res.status(200).json(usrs);
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
// getUserFromToken = (token)=>{
//     return jwt.decode(token)['_id'];

// }
// router.use("/user",verify_token,post_routes);

module.exports = router;