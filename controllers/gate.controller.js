const { Checklist } = require("../models/Checklist");
const { Checkout } = require("../models/Checkout");
const { Checkin } = require("../models/Checkin");
const { Student } = require("../models/StudentModel");
const { RecordModel } = require("../models/RecordModel");

module.exports = {
  CHECK_OUT: async (req, res) => {
    try {
      // check if studentid in checklist
      let inChecklist = await Checklist.findOne({ record: req.body.recordId });
      // check if studentid in checkout
      let inCheckout = await Checkout.findOne({ record: req.body.recordId });

      if (!inChecklist)
        return res.status(200).json({
          msg: "Sorry, You Cannot Proceed to Checkout",
          success: false,
        });

      // *********** ************* ************** ******************
      //     if user already in checkout list -> perform checkin process
      // *********** ************* ************** ******************

      if (inCheckout) {
        // console.log("Checking in...")
        const checkin = await new Checkin({
          student: inChecklist.student,
          record: inChecklist.record,
        });

        //find student profile picture from checkout list
        let studentProfile = await Student.findOne({ _id: inCheckout.student });

        let removed = await Checkout.findOneAndRemove({
          record: inChecklist.record,
        });

        const removedFromCheckList = await Checklist.findOneAndRemove({
          record: inChecklist.record,
        });

        // console.log(removedFromCheckList)

        if (removed) {
          await checkin.save();
          return res.json({
            checkedin: true,
            studentName:
              studentProfile.firstName + " " + studentProfile.lastName,
            profile: studentProfile.profile,
            msg: "Welcome, Great to have you back!",
            success: true,
            data: {
              student: inChecklist.student,
            },
          });
        }
      } else if (inChecklist) {
        // console.log("Checking out...")
        // if yes, add student with record id in the checkout
        const checkout = await new Checkout({
          student: inChecklist.student,
          record: inChecklist.record,
        });

        //find student profile picture from checklist
        let studentProfile = await Student.findOne({
          _id: inChecklist.student,
        });

        await checkout.save();
        return res.status(200).json({
          checkedout: true,
          studentName: studentProfile.firstName + " " + studentProfile.lastName,
          profile: studentProfile.profile,
          msg: "Hurray! Have a Great Journey :)",
          success: true,
          data: {
            student: inChecklist.student,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  GET_CHECK_LIST: async (req, res) => {
    try {
      // this route can only be accessed by the admins
      // headers [ x-auth-admin ] - > adminId
      const records = await Checklist.find({});

      if (records.length < 1)
        return res
          .status(404)
          .json({ msg: "No Recordss Found", success: false });

      res.json({
        success: true,
        data: {
          count: records.length,
          records,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
  CHECKOUT_LIST: async (req, res) => {
    try {
      // this route can only be accessed by the admins
      // headers [ x-auth-admin ] - > adminId
      const records = await Checkout.find({});

      if (records.length < 1)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        data: {
          count: records.length,
          records,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
  CHECKIN_LIST: async (req, res) => {
    try {
      const records = await Checkin.find({});

      if (records.length < 1)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        data: {
          count: records.length,
          records,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
  STATS: async (req, res) => {
    try {
      const checklist = await Checklist.find({});
      const checkouts = await Checkout.find({});
      const checkins = await Checkin.find({});

      res.json({
        success: true,
        data: {
          checklistCount: checklist.length,
          checkoutsCount: checkouts.length,
          checkinsCount: checkins.length,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
};
