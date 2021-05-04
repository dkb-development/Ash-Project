const router = require('express').Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const verify_token = require('../verify_token/user_verify_token');
const Post = require('../../models/Post');

// bcryptjs
const bcrypt = require('bcryptjs');
const { json } = require('express');

router.route('/create_post')
    .get((req,res)=>{res.json("Get Request on create post for client")})

    .post((req,res)=>{
        console.log("Post Request Details : ",req.body);
        res.json(req.body);
    })


// router.use("/user",verify_token,post_routes);

module.exports = router;