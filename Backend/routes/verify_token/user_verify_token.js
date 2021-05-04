const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const token = req.header('auth_token');
    if(!token){
        res.status(401).json("Can't login without token");
    }
    else{
        try{
            const token_verified = jwt.verify(token,process.env.TOKEN_SECRET);
            next();
        }
        catch(err){
            res.status(400).json(err);
        }
    }
}