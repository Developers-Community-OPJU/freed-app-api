const studentModel = require("../models/StudentModel");
const { Checklist } = require("../models/Checklist");
const { Checkout } = require("../models/Checkout");
const { Checkin } = require("../models/Checkin");
const fs = require("fs");
const path = require("path");

module.exports = {
  GET_DASHBOARD_DATA: async (req, res) => {
    try {
      const totalStudents = await studentModel.Student.find({});
      const totalStudentsHR1 = await studentModel.Student.find({
        residence: "HR1",
      });
      const totalStudentsHR2 = await studentModel.Student.find({
        residence: "HR2",
      });
      const totalStudentsHR3 = await studentModel.Student.find({
        residence: "HR3",
      });
      //   gateway
      const checklist = await Checklist.find({});
      const checkouts = await Checkout.find({});
      const checkins = await Checkin.find({});

      res.status(200).json({
        totalStudents: totalStudents.length,
        HR1: totalStudentsHR1.length,
        HR2: totalStudentsHR2.length,
        HR3: totalStudentsHR3.length,
        checklist: checklist.length,
        checkouts: checkouts.length,
        checkins: checkins.length,
      });
    } catch (error) {
      console.error("error no 896" + error);
      res.send(error);
    }
  },
  /**
   * checklist
   * checkout
   * checkin
   */
  GET_REPORTS: async (req, res) => {
    try {
      const checklist = await Checklist.find({})
        .populate({
          path: "student",
          select: "firstName lastName course branch semester room_no residence",
        })
        .populate({
          path: "record",
          select: "from to createdAt",
        });

      let checkouts = await Checkout.find({})
        .populate({
          path: "student",
          select: "firstName lastName course branch semester room_no residence",
        })
        .populate({
          path: "record",
          select: "from to createdAt",
        });

      let checkins = await Checkin.find({})
        .populate({
          path: "student",
          select: "firstName lastName course branch semester room_no residence",
        })
        .populate({
          path: "record",
          select: "from to createdAt",
        });

      const totalStudentNotVerified = await studentModel.Student.find({
        verified: false,
      });

      const totalStudentsHR1 = await studentModel.Student.find({
        residence: "HR1",
        verified: true,
      });
      const totalStudentsHR2 = await studentModel.Student.find({
        residence: "HR2",
        verified: true,
      });
      const totalStudentsHR3 = await studentModel.Student.find({
        residence: "HR3",
        verified: true,
      });

      const totalStudents =
        totalStudentsHR1.length +
        totalStudentsHR2.length +
        totalStudentsHR3.length;

      res.status(200).json({
        checklist,
        checkouts,
        checkins,
        totalStudents,
        totalStudentNotVerified,       
      });
    } catch (error) {
      console.error("error no 896" + error);
      res.send(error);
    }
  },
};
