const config = require('config')

const mongoose = require("mongoose");

// local for - development and testing
// remote for - production deployment

const url = config.get("_db").remote;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => { console.log("Connected to MongoDB Server..") })
    .catch(() => { console.log("Sorry,MongoDb Connection Failed! ") })