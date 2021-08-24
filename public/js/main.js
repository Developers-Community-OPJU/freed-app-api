const socket = io();

const id = "6109de65a8529e00042a7fd8";

// client needs to connect to admin
socket.emit('join', id)

socket.on("msg to student", (msg) => {
    console.log("msg to student from admin")
    alert(msg.msg)
})

// ADMIN
function sendMessage() {
    let message = document.querySelector("#input").value;
    socket.emit('msg from admin', {
        id: "6109de65a8529e00042a7fd8",
        msg: "msg from the admin on checkout / checkin"
    })

}
