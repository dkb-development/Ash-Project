const app = require('express')();
// Cors
var cors = require('cors');
app.use(cors());



// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set('Access-Control-Allow-Origin', '*');
    next();
});


const server = app.listen(8900);
const io = require('socket.io')(server,{
  cors: 
    {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Access-Control-Request-Headers"],
        credentials: true,
        handlePreflightRequest: (req, res) => {
          const headers = {
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
              "Access-Control-Allow-Origin": "*", //or the specific origin you want to give access to,
              "Access-Control-Allow-Credentials": true
          };
          res.writeHead(200, headers);
          res.end();
      }
    },
  });
// const io = require('socket.io')(server, 
//   {
//     cors: 
//     {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     },
//   }
// );
// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:4200",
//   },
// });

let users = [];

io.on("connection", (socket) => {
  //when ceonnect
  io.emit("welcome","Hello From backend Socket server");

  // Add new socket connection
  socket.on("addSocketInServer",(user_info)=>{
    addUser(user_info,socket);
    io.emit("getUsers", users);
    
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if(user){
      io.to(user.socket_id).emit("getMessage", {
        "sender_id" : senderId,
        "message_text": text,
      });
    }
    
  });

  //when disconnect
  socket.on("disconnect", () => {
    removeUser(socket);
    io.emit("getUsers", users);
  });

})


function addUser(user_info,socket_info){
  const found_old_info = users.some((user)=>user.user_id == user_info.user_id);
  if(found_old_info){
    users.map((user)=>{
      if(user.user_id == user_info.user_id){
        user.socket_id = socket_info.id;
      }
    })
  }
  else{
    users.push({
      ...user_info,
      "socket_id": socket_info.id
    });
  }
  console.log(user_info.username," is Connected");
}

function removeUser(socket_info){
  users = users.filter((user)=>user.socket_id != socket_info.id)
  
}

const getUser = (userId) => {
  return users.find((user) => user.user_id === userId);
};


























// const express = require('express');
// const dotenv = require('dotenv');

// // Config env Variables
// dotenv.config({path: './config/.env'});

// const app = express();
// const PORT = process.env.PORT || 5000;


// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// // Configure Morgan
// const morgan_config = require('./config/config_morgan');
// app.use(morgan_config);

// // cors
// var cors = require('cors');
// app.use(cors());

// // Connect to DB
// const mongoose = require('mongoose');
// mongoose.connect(process.env.mongoDB_native_driver,{                
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })
//     .then(()=>{console.log("Connected to DB ....");})
//     .catch((e)=>{console.log(e);})

// // Cors
// var cors = require('cors');
// app.use(cors());
// app.use((req,res)=>{
//     // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// })

// const server = app.listen(PORT, () => {
//   console.log(`Backend Chat Server is running in ${process.env.NODE_ENV} mode on Port No :  ${process.env.PORT}`)
// });
// // Socket-io
// const io = require("socket.io")(server);

// io.on('connection', client => {
//     console.log("A user connected");
//     client.on('Input Chat Message', msg => { 
        
//      });
//     client.on('Disconnect', () => { 
//         console.log("Socket Disconnected");
//      });
//   });



// // Routes
// // app.get('/',(req,res)=>{
// //     res.json("Hello");
// // })

// // app.listen(PORT,()=>{
// //     console.log(`Backend Server is running in ${process.env.NODE_ENV} mode on Port No :  ${process.env.PORT}`);
// // })