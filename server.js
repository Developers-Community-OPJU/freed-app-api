const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const config = require('config')

// CONFIGURING CONFIG JWTPRIVATEKEY
if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR : jwtPrivateKey is not defined");
    process.exit(1);
}

// CONFIGURING MONODB WITH MONGOOSE
require("./modules/mongoose.config")

app.use(morgan('tiny'));
app.use(cors());

// CONFIGURING BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
const students = require('./routes/student')
const records = require('./routes/records')
const auth = require('./routes/auth')
app.use('/api/student', students);
app.use('/api/records', records);
app.use('/api/auth', auth);


// establishing the server on the port 3000
const port = process.env.PORT || 3000;
const IP = process.env.IP;
app.listen(port, IP, () => {
    console.log(`Server Started on the port :: ${port} - ${IP}`);
});