const mongoose = require('mongoose');

const room = new mongoose.Schema({
    roomName: { type: String },
    currentPosition: { type: Number },
    status: { type: String },
    users: { type: Array },
    password: { type: String },
    createdOn: { type: Date },
    videoQueue: { type: Array },
    chat: { type: Array },
    description: { type: String }
})


const user = new mongoose.Schema({
    name: { type: String },
    token: { type: String },
    socket: { type: String }
})


module.exports = {
    roomSchema: mongoose.model('room', room),
    userSchema: mongoose.model('user', user)
}