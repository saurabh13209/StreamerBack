const mongoose = require('mongoose')

const URI = "mongodb+srv://saurabh13209:MongoDbPass@cluster0-fntgy.mongodb.net/test?retryWrites=true&w=majority"

const connectDb = async () => {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("Database connected")
    })
}

module.exports = connectDb;