
// const asf1 = async ()=>{
//     await setTimeout(()=>{
//         console.log("Inside Async Function 1");
//         return 1;
//     },3000);
    
// }
// const asf2 = async ()=>{
//     await setTimeout(()=>{
//         console.log("Inside Async Function 2");
//         return 2;
//     },3000);
// }

// const calingFunc = async ()=>{
//     var two;
//     var one = await asf1().then(async (res)=>{
//         two = await asf2();
//         return res;
//     });
//     console.log(one);
//     console.log(two);
// }

// calingFunc();

// const express = require('express');
const express = require('express');
const app = express();
const router = require('express').Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=446&date=19-05-2021';
router.get(url,(req,res)=>{
    for(var session in res.sessions){
        if(session.min_age_limit == 18){
            console.log(session);
        }
    }
})

app.use('/',router);
app.listen(4000,()=>{
    console.log(`Backend Server is running at PORT No : 4000`);
})
