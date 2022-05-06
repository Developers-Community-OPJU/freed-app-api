const config = require("config");

//setting up the twilio service
const sid = config.get("_twilio").sid;
const token = config.get("_twilio").auth_token;
const client = require("twilio")(sid, token, {
  logLevel: "debug",
});

module.exports = {
  verificationSMS: async (to) => {
    try {
      client.messages
        .create({
          body: "Your Freed Account has been verified!",
          from: "+919109977086",
          to: to,
        })
        .then((message) => {
          console.log(message.sid);
          console.log(message);
          return message;
        });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
