const User = require('../User');
const Post = require('../Post');
const Tip = require('../Tip');

module.exports.getUserDetails = async (_id)=>{
    return await User.findById(_id);
}
module.exports.getPosts = async ()=>{
    return await Post.find({}).sort({date_created: -1})
}
module.exports.isTipEnough = async (post_id,user_id,tip_to_onlock)=>{
    var res = false;
    return await Tip.find(
        {
            tip_post_id: post_id,
            tip_by: user_id
        }
    ).then((tip_details)=>{
        if(tip_details.tip_amount >= tip_to_onlock){
            console.log("tip_details.tip_amount >= tip_to_onlock")
            // res = true;
            return true;
        }
        else{
            console.log("tip_details.tip_amount < tip_to_onlock")
            // res = true;
            res = false;
            return false;
        }
    }).catch((err)=>{
        console.log("Error : ",err);
        return false;
    })
    console.log("Result : ",res);
    return res;
}
// module.exports.getUserDetails = (_id)=>{
//     var user;
//     User.findById(_id,(err,usr)=>{
//         if(err){return null}
//         else{
//             console.log("User Info : ",usr);
//             user = usr;
//         }
//     })

//     return user;
// }