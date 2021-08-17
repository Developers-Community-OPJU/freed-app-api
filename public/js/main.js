const socket = io();


//CLIENT 

// client needs to connect to admin
socket.emit('join', {
    id: "12345678",
    Name: "Aman Vishwakarma",
})

socket.on("msg to student", (msg) => {
    console.log("msg to student")
    alert(msg)

})

// ADMIN

function sendMessage() {
    let message = document.querySelector("#input").value;
    socket.emit('msg from admin', {
        id: "12345678",
        name: "Aman Vishwakarma",
    })

}
