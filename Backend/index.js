const express = require('express');
var cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const User = require('./models/User');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDB_native_driver,{                
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(()=>{console.log("Connected to DB ....");})
    .catch((e)=>{console.log(e);})


// mongoose.connection.on('error',(err)=>{console.log(err);})

// mongoose.connection
//     .once('open',()=>{console.log("Connected");})
// mongoose.connection.on('disconnect',(err)=>{console.log("Connected : ",err);});


// Configure Morgan
const morgan_config = require('./config/config_morgan');
app.use(morgan_config);

// Import Routes
app.use(cors());


// Passport Authentication
const passport = require('passport');
require('./config/passport_config');
app.use(passport.initialize());


const user_routes = require('./routes/User/user_rout');
const client_routes = require('./routes/Client/client_routes');
// app.use("/client",verify_token,post_routes);
app.use("/client",client_routes);
app.use("/user",user_routes);
const presigned_url_routes = require('./routes/Client/presigned_url_routes');
app.use('/',presigned_url_routes);
app.listen(3000,()=>{
    console.log(`Backend Server is running at PORT No : ${PORT}`);
})

module.exports.app = app;