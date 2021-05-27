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
const post_routes = require('./routes/User/posts');
const conversation_routes = require('./routes/conversation');
const message_routes = require('./routes/messages');
// app.use("/client",verify_token,post_routes);
app.use("/",post_routes);
app.use("/client",client_routes);
app.use("/user",user_routes);
const presigned_url_routes = require('./routes/Client/presigned_url_routes');
app.use('/',presigned_url_routes);
app.use("/conversations", conversation_routes);
app.use("/messages", message_routes);


app.listen(3000,()=>{
    console.log(`Backend Server is running at PORT No : ${PORT}`);
})

app.use((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","http://example.com");
})


// var webSocketPort = 5000;
// const chat_server = app.listen(webSocketPort, () => {
//     console.log(`Backend Chat Server is running in ${webSocketPort} mode on Port No :  ${webSocketPort}`)
//   });
// Socket-io
// var server = require('http').createServer(app)
//   .listen(webSocketPort, function() {
//     console.log("WebSocket listening on port %d", webSocketPort);
//   });   
// var socketIO = require('socket.io')(chat_server,{
//     cors: {
//         origin: '*',
//       }
// });
// socketIO.on("connection", socket => {
//     console.log("One User Connected");
//     socket.emit("receive",'Hello World from Backend');
//     socket.on("message", msg => {
//         console.log(msg);
//         socket.emit("receive",'Hello World from Backend');   
//      })
     
  
//   })
module.exports.app = app;