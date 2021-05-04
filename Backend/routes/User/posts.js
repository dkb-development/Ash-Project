const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

router.get('/posts',async (req,res)=>{
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
    res.json(["Hello","World","from","Backend"])
});
module.exports = router;