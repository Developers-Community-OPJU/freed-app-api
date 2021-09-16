const { Admin ,VALIDATE_REGISTER} = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = {
  LIST_OF_ADMIN: async (req, res) => {
    try {
      // List all the admin users
      const users = await Admin.find({}).select("-__v -password");

      if (!users) {
        return res.status(200).json({
          msg: `Found (${users.length})'s`,
          success: false,
        });
      }

      // sending the list of the users
      res.status(200).json({
        msg: `Found (${users.length}) user's`,
        success: true,
        users,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // ADD A NEW ADMIN USER
  ADD_NEW_USER: async (req, res) => {
    try {
      // VALIDATING THE REQ
      const { error } = VALIDATE_REGISTER(req.body);
      if (error)
        return res
          .status(400)
          .json({ msg: "Validation Failed", error: error.details[0].message });

      // CHECK IF THE USER EXITS
      let user = await Admin.findOne({ username: req.body.username });
      if (user)
        return res.json({ msg: "User Already Exists!", success: false });

      // get form data from body
      // id is the id of the admin [ WARDEN / HOD]
      let { firstname, lastname, username, adminIs, email, contact } = req.body;

      user = new Admin({
        firstname,
        lastname,
        adminIs,
        email,
        contact,        
        username,
        password : username
      });     
      
      // HASING PASSWORD USING BCRYPT
      const salt = await bcrypt.genSalt(15);
      user.password = await bcrypt.hash(user.password, salt);

      const result = await user.save();

      res.status(200).json({
        msg: "User Added Successfully!",
        success: true,
        result,
      }); 

    } catch (error) {
      console.error(error);
    }
  },
};
