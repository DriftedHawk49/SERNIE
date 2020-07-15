const app = require("express")();
const server = app.listen(3000);
const io = require("socket.io").listen(server);
const mongoose = require('mongoose');
const cors = require('cors');
const socketController = require('./socket.controller');
const ssFunctions = require('./socketServerFunctions');

const db = 'mongodb://localhost:27017/sernie';

let activeUsers = [];

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("database connected. SOCKET SERVER");
}).catch((err)=>{
    console.log(err);
    console.log("Database Connect Failed");
});

app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true
}));

io.on("connection",socket=>{
    console.log("New User Connected");
    socket.emit('response',{status: "CONNECT", success: false});


    socket.on("CON",function(data){
        console.log("Saving Socket to Active User Database");
        data = JSON.parse(data);
        const soc = {
            userID: data.userID,
            socNode: socket
        }
        activeUsers = socketController.addNewSocket(soc,activeUsers);
    });

    socket.on("message",(message)=>{
        message = JSON.parse(message);
        ssFunctions.identifierFunction(message,socket,activeUsers);
    });

    socket.on("disconnect",function(){
        console.log("User Disconnected");
        activeUsers = socketController.removeSocket(socket,activeUsers);
    });
});



