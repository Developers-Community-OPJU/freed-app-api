const socket = io();

socket.on("msg to student", (msg) => {
    console.log("msg to student")
    alert(msg)
})

function sendMessage() {
    let message = document.querySelector("#input").value;
    socket.emit('msg from admin', message)

}