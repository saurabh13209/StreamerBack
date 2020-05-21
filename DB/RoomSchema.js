const mongoose = require('mongoose');

const room = new mongoose.Schema({
    videoUrl: { type: String },
    title: { type: String },
    image: { type: String },
    channelId: { type: String },
    currentPosition: { type: Number },
    status: { type: String },
    users: { type: Array },
    password: { type: String },
    createdOn: { type: Date }
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