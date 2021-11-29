const server = require("http").createServer(app);
const io = require("socket.io")(server);

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