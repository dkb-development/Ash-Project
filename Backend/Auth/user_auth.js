const mongoose = require('mongoose');
const passport = require('passport');
// const _ = require('lodash');
// bcryptjs
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.save((err, doc) => {
        if (!err){
            return res.status(200).json({
                "_id" : doc['_id'],
                "token" : user.generateJwt()
            });

        }
        else {
            if (err.code == 11000)
                // res.status(422).send(['Duplicate email or username found.']);
                if(User.findOne(user.username)){
                    res.status(422).send(['Duplicate username found.']);
                }
                else{
                    res.status(422).send(['Duplicate email found.']);
                }
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ 
            "token": user.generateJwt() 
        });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user_info : user });
        }
    );
}


//Verify JWT 
const jwt = require('jsonwebtoken');
module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}