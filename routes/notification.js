const express = require("express");
const router = express.Router();
var FCM = require("fcm-node");
var serverKey =
  "AAAAJ_IgeEQ:APA91bErqxR4pG7QV5ReXc8BQys_LHswHjVXycnFoSZOti3tNsOYlqYZI_pEVk6IMSe48z4lOokCvNz_TpTKFZCLZjWdgLlaPV75Disge26GJ6THPMk29eTFO6YU2spWKCijVCJPWyHS"; //put your server key here
var fcm = new FCM(serverKey);

// SEND NOITIFICATION
router.post("/send/:sender-id", async (req, res) => {

    // get msg from the body  

  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: "registration_token",

    notification: {
      title: "Notification from warden",
      body: "A really good message from warden on your request",
    },

    // PASS YOUR DATA AS NEEDED
    data: {
      my_key: "my value",
      my_another_key: "my another value",
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
});

module.exports = router;
