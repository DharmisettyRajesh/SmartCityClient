const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const username = require('username-generator')
const path = require('path')
const mongoose=require('mongoose');
const bodyparser = require('body-parser');
const cors=require('cors');


const routes = require('./Routes/Signup.js');
const users={}

app.use(cors());
app.use(bodyparser.json());
app.use('/api',routes);


io.on('connection', socket => {
    //generate username against a socket connection and store it
    const userid=username.generateUsername('-')
    if(!users[userid]){
        users[userid] = socket.id
    }
    //send back username
    socket.emit('yourID', userid)
    io.sockets.emit('allUsers', users)
    
    socket.on('disconnect', ()=>{
        delete users[userid]
    })

    socket.on('callUser', (data)=>{
        io.to(users[data.userToCall]).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall', (data)=>{
        io.to(users[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', (data)=>{
        io.to(users[data.to]).emit('close')
    })

    socket.on('rejected', (data)=>{
        io.to(users[data.to]).emit('rejected')
    })
})

const port = process.env.PORT || 8000

mongoose.connect(
    `mongodb+srv://${process.env.DATABASEUSER}:${process.env.DATABASEPASSWORD}@cluster0-grn1p.mongodb.net/${process.env.DATABASENAME}?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true}

).then(()=>{
server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
}) 
})
.catch((error)=>{
    console.log("Something went wrong");
    console.log(error);
})
