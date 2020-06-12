const express = require("express")
const { roomSchema, userSchema } = require('../DB/RoomSchema');   // Schema
const route = express.Router();             // routes

route.post("/createRoom", (req, res) => {
    new roomSchema({
        roomName: req.body.roomName,
        videoUrl: req.body.videoUrl,
        currentPosition: req.body.currentPosition,
        status: req.body.status,
        users: req.body.users,
        password: req.body.password,
        createdOn: req.body.createdOn,
        videoQueue: req.body.videoQueue,
        chat: []
    }).save();
    res.json()
})

route.post("/addVideo", (req, res) => {
    roomSchema.update(
        {
            roomName: req.body.roomName
        },
        {
            $set: {
                videoQueue: req.body.videoQueue
            }
        },
        (err, doc) => {
            if (err) return
            roomSchema.find({ "roomName": req.body.roomName }, (err, doc) => {
                if (err) return
                var socketsId = []
                var tempUserArray = [];
                if (doc.length == 0) return
                doc[0]["users"].forEach((user, index) => {
                    tempUserArray = [
                        ...tempUserArray,
                        user
                    ]
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
                                socketsId.forEach(id => io.to(id).emit("updateQueue", req.body))
                            }
                        })
                    })
                }
            })
            res.json()
        }
    )
})

route.post("/getMessage", (req, res) => {
    roomSchema.find({ "roomName": req.body.roomName }, (err, doc) => {
        console.log(doc[0].chat)
        res.json(doc[0].chat)
    })
})

route.post("/createUser", (req, res) => {
    new userSchema({
        name: req.body.name,
        token: "",
        socket: ""
    }).save()
    res.json()
})


route.post("/getRoom", (req, res) => {
    roomSchema.find({}, (err, docs) => {
        if (err) res.json(err)
        else res.json(docs)
    })
})

route.post("/addUser", (req, res) => {
    roomSchema.update(
        {
            roomName: req.body.roomName
        },
        {
            $set: {
                users: req.body.users
            }
        },
        (err, doc) => {
            if (err) return
            res.json()
        }
    )
})

module.exports = route