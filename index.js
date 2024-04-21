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

io.on("connection",(socket) => {
    socket.on("send-code",(data) => {
        io.emit("get-code",data)
    })
})

app.use(express.json())
app.use(cors({
    origin:'*'
}));

app.post('/playground/run', compiler);


server.listen(8000, () => {
    console.log("Server started on port 8000");
})