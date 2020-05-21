const express = require("express")
const { roomSchema, userSchema } = require('../DB/RoomSchema');   // Schema
const route = express.Router();             // routes

route.post("/createRoom", (req, res) => {
    new roomSchema({
        videoUrl: "1KMCKphn6CY",
        currentPosition: 0,
        status: "Loading",
        users: [{ id: "saurabh13209", role: "Host" }, { id: "vikas", role: "User" }],
        password: "",
        createdOn: new Date()
    }).save();
    res.json()
})

route.post("/createUser", (req, res) => {
    new userSchema({
        name: "saurabh13209",
        token: "",
        socket: ""
    }).save()
    res.json()
})

route.post("/getRoom", (req, res) => {
    roomSchema.find({ videoUrl: "1KMCKphn6CY" }, (err, docs) => {
        if (err) res.json(err)
        else res.json(docs)
    })
})

route.post("/updateData", (req, res) => {
    console.log("K")
    res.json();
})


module.exports = route