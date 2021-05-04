const router = require('express').Router();
const User = require('../../models/User');
const post_routes = require('./posts');
const jwt = require('jsonwebtoken');
const verify_token = require('../verify_token/user_verify_token');




const user_auth = require('../../Auth/user_auth');
router.post('/signup', user_auth.register); // "/user/signup"
router.post('/login', user_auth.authenticate); // "/user/login"
router.get('/userProfile',user_auth.verifyJwtToken, user_auth.userProfile);

// router.get("/",(req,res)=>{
//     console.log(req.headers);
//     res.send("Hello World from backend");
// })
// router.post("/signup", async (req,res)=>{
//     console.log("Request came from : ",req.ip);

    
//     const email_exist = await User.findOne({email:req.body.email});
//     if(email_exist){
//         return res.status(400).send("Email already Exist");
//     }
//     try{
//         const salt = await bcrypt.genSalt(10);
//         const hashed_password = await bcrypt.hash(req.body.password, salt);
//         const new_user = new User( {
//             username : req.body.username,
//             email : req.body.email,
//             password : hashed_password
//         });
    
//         const saved_user = await new_user.save();
//         res.json(new_user);
//     }
//     catch(err){
//         console.log(err);
//         res.status(400).json(err);
//     }


    
//     // "mongodb": "^3.6.6",
    
// })

// router.post("/login", async (req,res)=>{
//     console.log("Request came from : ",req.ip);

//     const new_user = new User( {
//         email : req.body.email,
//         password : req.body.password
//     });
    
//     const user = await User.findOne({email:req.body.email});
//     if(!user){
//         return res.status(400).send("Email doesn't Exist");
//     }
//     try{
//         const user_password_valid = await bcrypt.compare(req.body.password,user.password);
//         if(!user_password_valid){
//             res.status(400).json("Invalid Password");
//         }
//         else{
//             const token = await jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
//             res.header('auth_token', token).json({msg:"User succcessfully LoggedIn"});  
//         }
        
//     }
//     catch(err){
//         console.log(err);
//         res.status(400).json(err);
//     }


    
//     // "mongodb": "^3.6.6",
    
// })

// // router.use("/user",verify_token,post_routes);
// router.use("/user",post_routes);

module.exports = router;