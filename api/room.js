const express = require("express")
const mongoose = require('mongoose');       // MongoDb fucn
const User = require('../DB/RoomSchema');   // Schema
const route = express.Router();             // routes

route.post("/createRoom", (req, res) => {
    new User({
        videoUrl: "https://youtube.com",
        currentPosition: { hour: 0, min: 13, sec: 20 },
        users: [{ id: "10029302", role: "Host" }, { id: "10293", role: "User" }],
        password: "",
        createdOn: new Date()
    }).save();
    res.json()
})

route.post("/getRoom", (req, res) => {
    User.find({}, (err, docs) => {
        if (err) res.json(err)
        else res.json(docs)
    })
})

module.exports = route