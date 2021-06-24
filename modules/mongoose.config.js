const config = require('config')

const mongoose = require("mongoose");
const url = config.get("_db").remote;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => { console.log("Connected to MongoDB Server..") })
    .catch(() => { console.log("Sorry,MongoDb Connection Failed! ") })