const mongoose = require('mongoose');

const room = new mongoose.Schema({
    videoUrl: { type: String },
    currentPosition: { type: Object },
    users: { type: Array },
    password: { type: String },
    createdOn: { type: Date }
})

module.exports = Room = mongoose.model('room', room)