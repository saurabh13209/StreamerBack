const express = require("express")
const { roomSchema, userSchema } = require('../DB/RoomSchema');   // Schema
const route = express.Router();             // routes

route.post("/createRoom", (req, res) => {
    console.log(req.body)
    new roomSchema({
        videoUrl: req.body.videoUrl,
        title: req.body.title,
        image: req.body.image,
        channelId: req.body.channelId,
        currentPosition: req.body.currentPosition,
        status: req.body.status,
        users: req.body.users,
        password: req.body.password,
        createdOn: req.body.createdOn
    }).save();
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
            videoUrl: req.body.videoUrl
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