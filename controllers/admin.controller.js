const { Admin, VALIDATE_REGISTER } = require("../models/AdminModel");
const { RecordModel } = require("../models/RecordModel");
const bcrypt = require("bcryptjs");

module.exports = {
  GET_HOD_RECORDS: async (req, res) => {
    try {
      const { admin_id } = req.params;

      // GET ADMIN AND VERIFY IF IT EXISTS
      const admin = await Admin.findOne({
        _id: admin_id,
      });

      if (!admin)
        return res
          .status(404)
          .json({ msg: "Something went wrong", success: false });

      //  get all the records
      let records = await RecordModel.find({
        "approval.sent_for_approval": true,
      })
        .populate({
          path: "student",
          select: "firstName lastName course branch semester",
        })
        .select("student approval from to");

      // GET RECORDS WITH ADMIN.DEPT == RECORD.Student.branch
      records = records.filter((record) => {
        return record.student.branch == admin.department;
      });

      res.status(200).json({
        msg: `Records Found - ${records.length}`,
        success: true,
        records,
      });
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },

  GET_ADMIN_RECORDS: async (req, res) => {
    try {
      const { admin_id } = req.params;

      // GET ADMIN AND VERIFY IF IT EXISTS
      const admin = await Admin.findOne({
        _id: admin_id,
      });

      // display "something went wrong" when admin doesnt exists - 404
      if (!admin)
        return res
          .status(404)
          .json({ msg: "Something went wrong", success: false });

      //  get all the records for the warden with their respective resisence or hostels
      let records = await RecordModel.find({}).populate({
        path: "student",
        select:
          "firstName lastName course branch semester residence profile verified",
      });
      // .select("student approval from to");

      // GET RECORDS WITH ADMIN.DEPT == RECORD.Student.branch
      records = records.filter((record) => {
        return (
          record.student.verified &&
          record.student.residence == admin.department
        );
      });

      if (records.length == 0)
        return res
          .status(400)
          .json({ msg: "No Records found", success: false });

      res.status(200).json({
        msg: `Records Found - ${records.length}`,
        success: true,
        records,
      });
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },

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
      let user = await Admin.findOne({ employeeCode: req.body.employeeCode });
      if (user)
        return res.json({ msg: "User Already Exists!", success: false });

      // get form data from body
      // id is the id of the admin [ WARDEN / HOD]
      let {
        firstname,
        lastname,
        employeeCode,
        adminIs,
        email,
        contact,
        department,
      } = req.body;

      user = new Admin({
        firstname,
        lastname,
        adminIs,
        email,
        contact,
        department,
        employeeCode,
        password: employeeCode,
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
      res.send(error);
    }
  },

  // REMOVE ADMIN USER
  REMOVE_ADMIN_USER: async (req, res) => {
    try {
      // CHECK IF THE USER EXITS
      // parsing eid from query object where 
      console.log(req.query.id)
      let user = await Admin.findOneAndDelete({
        _id: req.query.id,
      });
      if (!user)
        return res.json({ msg: "User does not exists!", success: false }).status(400);

      res
        .json({
          msg: "User removed successfully!",
          success: true,
        })
        .status(200);

    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },
};
