const express = require('express');
const dotenv = require('dotenv');

// Config env Variables
dotenv.config({path: './config/.env'});

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configure Morgan
const morgan_config = require('./config/config_morgan');
app.use(morgan_config);

// cors
var cors = require('cors');
app.use(cors());

// Connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDB_native_driver,{                
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(()=>{console.log("Connected to DB ....");})
    .catch((e)=>{console.log(e);})

// Cors
var cors = require('cors');
app.use(cors());
app.use((req,res)=>{
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
})

const server = app.listen(PORT, () => {
  console.log(`Backend Chat Server is running in ${process.env.NODE_ENV} mode on Port No :  ${process.env.PORT}`)
});
// Socket-io
const io = require("socket.io")(server);

io.on('connection', client => {
    console.log("A user connected");
    client.on('Input Chat Message', msg => { 
        
     });
    client.on('Disconnect', () => { 
        console.log("Socket Disconnected");
     });
  });



// Routes
// app.get('/',(req,res)=>{
//     res.json("Hello");
// })

// app.listen(PORT,()=>{
//     console.log(`Backend Server is running in ${process.env.NODE_ENV} mode on Port No :  ${process.env.PORT}`);
// })