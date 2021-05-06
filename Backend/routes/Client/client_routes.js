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

// getUserFromToken = (token)=>{
//     return jwt.decode(token)['_id'];

// }
// router.use("/user",verify_token,post_routes);

module.exports = router;