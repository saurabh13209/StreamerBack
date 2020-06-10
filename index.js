var express = require('express');
var socket = require('socket.io');
var app = express();
const connectDb = require('./DB/connection')
const route = express.Router();             // routes

var { roomSchema, userSchema } = require("./DB/RoomSchema");
connectDb();
app.use(express.json({ extended: false }))

app.use("/api/room", require("./api/room"))

var PORT = process.env.PORT || 4000
var server = app.listen(PORT, () => {
    console.log("server started");
});

// this is io which need to be called to room.js function
var io = socket(server);
io.on('connection', (socket) => {
    // update user data socket
    socket.on("updateUser", res => {
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
                "roomName": res.roomName
            },
            {
                $set: {
                    "currentPosition": res.currentTime,
                    "status": res.status
                }
            },
            (err, doc) => {
                if (err) return
                roomSchema.find({ "roomName": res.roomname }, (err, doc) => {
                    if (err) return
                    var socketsId = []
                    var tempUserArray = [];
                    if (doc.length == 0) return
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
                            userSchema.find({ "name": user["name"] }, (err, userDoc) => {
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
                    userSchema.find({ "name": user["name"] }, (err, userDoc) => {
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

    // Close the room
    socket.on("closeRoom", res => {
        roomSchema.find({ videoUrl: res }, (err, doc) => {
            if (doc.length == 0) return
            var usersArray = [];
            doc[0].users.forEach(user => {
                if (user["role"] == "User") {
                    usersArray = [
                        ...usersArray,
                        user["name"]
                    ]
                }
            })
            if (usersArray.length > 0) {
                var socketsId = [];
                usersArray.forEach((user, index) => {
                    userSchema.find({ "name": user }, (err, userDoc) => {
                        socketsId = [
                            ...socketsId,
                            userDoc[0]["socket"]
                        ]

                        if (usersArray.length - 1 == index) {
                            console.log(socketsId)
                            socketsId.forEach(id => io.to(id).emit("closeVideo", {}))
                            roomSchema.deleteOne({ videoUrl: res }, (err, doc) => {
                                if (err) console.log(err)
                            })
                        }
                    })
                })
            } else {
                console.log("k")
                roomSchema.deleteOne({ videoUrl: res }, (err, doc) => {
                    if (err) console.log(err)
                })
            }
        })
    })

    // Remove user
    socket.on("removeUser", res => {
        roomSchema.update(
            {
                videoUrl: res.videoUrl
            }, {
            $set: {
                "users": res.newUser
            }
        },
            (err, doc) => {
                if (err) return
            }
        )

    })


});
