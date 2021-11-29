const { Student } = require("../models/StudentModel");

module.exports = {
  LIST_STUDENTS: async (req, res) => {
    try {
      // FINDING STUDENT WITH ID
      const students = await Student.find({});
      res.status(200).json({
        students,
        success: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
   GET_STUDENT: async (req, res) => {
    try {
      // FINDING STUDENT WITH ID
      const student = await Student.find({_id : req.params.id});
      res.status(200).json({
        student,
        success: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
  
  VERIFY_STUDENT: async (req, res) => {
    try {     
      const verified = await Student.updateOne(
        {
          _id: req.params.id,
        },
        {
          verified: true,
        }
      );
      res.status(200).json({ verified, success: true });
    } catch (error) {
      console.error(error);
    }
  },
};
