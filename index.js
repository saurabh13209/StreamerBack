var express = require('express');
var socket = require('socket.io');
var app = express();
const connectDb = require('./DB/connection')

connectDb();
app.use(express.json({ extended: false }))

app.use("/api/room", require("./api/room"))

app.listen(4000, () => {
    console.log("server started");
});


var io = socket(server);
io.on('connection', (socket) => {
    console.log('socket connection id : ', socket.id);
    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
});
