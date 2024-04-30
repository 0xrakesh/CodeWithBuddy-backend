const express = require("express")
const app = express()
const cors = require('cors')
const http = require("http")

const server = http.createServer(app)
const socketIO = require('socket.io')

const io = socketIO(server,{
    cors:"*"
})

const {compiler} = require('./Routers/compiler') 
const database = require("./Routers/database")
const {register, login} = require("./Routers/users");
const {auth} =require("./Middleware/auth")

io.on("connection",(socket) => {
    console.log("ID of the socket ",socket.id)
    socket.on("send-code",(data,roomName) => {
        io.to(roomName).emit("get-code",data)
    });

    socket.on("room-create", (roomId) => {
        console.log("Create room", roomId)
        socket.join(roomId)
        io.to(roomId).emit("get-room","room created")
    });

    socket.on("join-room", (roomId) => {
        console.log("Join ",roomId, socket.id)
        socket.join(roomId)
        io.to(roomId).except(socket.id).emit("get-room","Some one join the room")
    })
})

app.use(express.json())
app.use(cors({
    origin:'*'
}));


database.connection();

app.post("/middleware/auth", auth);

app.post('/playground/run', compiler);
app.get("/",(req,res) => res.send("Code With Buddy up now"));


app.post("/register", register);
app.post("/login", login);


server.listen(8000, () => {
    console.log("Server started on port 8000");
})
