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
        videoQueue: req.body.videoQueue
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
            res.json()
        }
    ).then(res => {
        // Call socket and emit to add that video has been upcdated
    })
    res.json()
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

