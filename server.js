// const path = require('path')
// const http = require('http')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const config = require('config')
const server = require('http').createServer(app)
const io = require('socket.io')(server);

// const public_path = path.join(__dirname, "../public")
app.use(express.static('public'))

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

app.get('/', (req, res) => {
    res.send('/public/index.html');
})

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


/////////////////////////////////////////////
//    SOCKET cONNECTION FOR NOTIFICATIONS 
/////////////////////////////////////////////


io.on('connection', (socket) => {
    socket.on('join', (cred) => {
        console.log("user connected with id : " + cred.id)
        socket.join(cred.id)
    })
    // get noitification along with student id from the admin 

    // send the noitification to the student with provided id

    // waiting for msg from admin
    socket.on("msg from admin", (msg) => {
        console.log("msg from admin", msg.name)
        console.log(msg.name + "'s Request Accepted")
        const res = `Hey! ${msg.name} your request has been accepted`        // sending msg to student       
        socket.broadcast.to(msg.id).emit('msg to student', res)
    })
});




// establishing the server on the port 3000
const port = process.env.PORT || 3000;
const IP = process.env.IP;
server.listen(port, IP, () => {
    console.log(`Server Started on the port :: ${port} - ${IP}`);
});