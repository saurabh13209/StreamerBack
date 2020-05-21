var express = require('express');
var socket = require('socket.io');
var app = express();
const connectDb = require('./DB/connection')
var { roomSchema, userSchema } = require("./DB/RoomSchema");
connectDb();
app.use(express.json({ extended: false }))

app.use("/api/room", require("./api/room"))

var server = app.listen(4000, () => {
    console.log("server started");
});


var io = socket(server);
io.on('connection', (socket) => {
    // update user data socket
    socket.on("updateUser", res => {
        console.log(res)
        userSchema.update(
            {
                "name": res.name
            },
            {
                $set: {
                    "socket": res.id
                }
            },
            (err, des) => {
                if (err) console.log(err)
            }
        )
    })

    // Host Function update video data
    socket.on("setVideoData", res => {
        roomSchema.update(
            {
                "videoUrl": "1KMCKphn6CY"
            },
            {
                $set: {
                    "currentPosition": res.currentTime,
                    "status": res.status
                }
            }
        );
    })

    // update other data to change status
    socket.on("stateChange", res => {
        roomSchema.find({ "videoUrl": res.id }, (err, doc) => {
            var socketsId = []
            var tempUserArray = [];
            doc[0]["users"].forEach((user, index) => {
                if (user["role"] != "Host") {
                    tempUserArray = [
                        ...tempUserArray,
                        user
                    ]
                }
            })
            if (tempUserArray.length > 0) {
                tempUserArray.forEach((user, index) => {
                    userSchema.find({ "name": user["id"] }, (err, userDoc) => {
                        socketsId = [
                            ...socketsId,
                            userDoc[0]["socket"]
                        ]

                        if (tempUserArray.length - 1 == index) {
                            console.log(socketsId)
                            socketsId.forEach(id => io.to(id).emit("updateVideo", res))
                        }
                    })
                })
            }
        })
        socket.broadcast
    })


});
