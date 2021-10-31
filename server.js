const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const config = require("config");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const ejs = require('ejs')
// Config Cluster
const cluster = require("cluster");
// Check the number of available CPU.
const numCPUs = require("os").cpus().length;

// CONFIGURING CONFIG JWTPRIVATEKEY
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR : jwtPrivateKey is not defined");
  process.exit(1);
}

// CONFIGURING MONODB WITH MONGOOSE
require("./modules/mongoose.config");

app.use(morgan("tiny"));
app.use(cors());

// CONFIGURING BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static("public"));
// set the view engine to ejs
app.set('views', './public');
app.set('view engine', 'ejs');

app.get("/downloads/", (req, res) => {
  res.render('admin')
});

const students = require("./routes/student");
const records = require("./routes/records");
const auth = require("./routes/auth.student");
const gateway = require("./routes/gate");
const authAdmin = require("./routes/auth.admin");
const admin = require("./routes/admin");

// ROUTES
app.use("/api/student", students);
app.use("/api/records", records);
app.use("/api/gateway", gateway);
app.use("/api/auth", auth);
app.use("/api/auth/admin", authAdmin);
app.use("/api/admin", admin);


app.get('*', (req,res)=>{
  res.status(400).send("Not Found")
})
/////////////////////////////////////////////
//    SOCKET cONNECTION FOR NOTIFICATIONS
/////////////////////////////////////////////

io.on("connection", (socket) => {
  // connecting student
  socket.on("join", (id) => {
    socket.join(id);    
  });

  // waiting for msg from admin
  socket.on("msg from admin", (student) => {    
    // get student id and msg from the gate-app
    // send the noitification to the student with provided id

    // sending msg to student
    socket.broadcast.to(student.id).emit("msg to student", {
      msg: student.msg,
      success: true,
    });      
  });
});

// config cluster for parallel processing
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // This event is firs when worker died
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}

// For Worker
else {
  // Workers can share any TCP connection
  // establishing the server on the port 3000
  const port = process.env.PORT || config.get("_process").PORT;
  const IP = process.env.IP || config.get("_process").IP;
  server.listen(port, IP, () => {
    console.log(
      `Client Server Started Processs ${process.pid} :: http://${IP}:${port} `
    );
  });
}
