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


const students = require('./routes/student')
const records = require('./routes/records')
const auth = require('./routes/auth')
const gateway = require('./routes/gate')
const authAdmin = require('./routes/auth.admin')

// ROUTES
app.use('/api/student', students);
app.use('/api/records', records);
app.use('/api/gateway', gateway);
app.use('/api/auth', auth);
app.use('/api/auth/admin', authAdmin);


// establishing the server on the port 3000
const port = process.env.PORT || 3000;
const IP = process.env.IP;
app.listen(port, IP, () => {
    console.log(`Server Started on the port :: ${port} - ${IP}`);
});