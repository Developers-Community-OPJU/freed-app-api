const { Admin } = require("../models/AdminModel");

module.exports = {
  LIST_OF_ADMIN: async (req, res) => {
    try {
        // List all the admin users
      const users = await Admin.find({}).select('-__v -password');

      if (!users) {
        return  res.status(200).json({
            msg: `Found (${users.length})'s`,
            success: false,
          });
      }

      // sending the list of the users
      res.status(200).json({
        msg: `Found (${users.length}) user's`,
        success: true,
        users
      });

    } catch (error) {
      console.error(error);
    }
  },
};
