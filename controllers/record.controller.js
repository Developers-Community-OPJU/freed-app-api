const { json } = require("body-parser");
const { RecordModel, VALIDATE_RECORD } = require("../models/RecordModel");
const { Admin } = require("../models/AdminModel");
const { Checklist } = require("../models/Checklist");
const { exist, array } = require("joi");
const { Student } = require("../models/StudentModel");

module.exports = {
  // LIST ALL LEAVE FORMS
  GET_ALL: async (req, res) => {
    try {
      const records = await RecordModel.find({})
        .populate({
          path: "student",
          select: "firstName lastName course branch semester",
        })
        .select("-__v -device_id -reason -remark_by_warden -approval");

      if (!records)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        records,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // LIST ALL LEAVE FORMS
  GET_STUDENT_RECORD: async (req, res) => {
    try {
      console.log(req.params.id, req.params.studentId);
      // FINDING RECORD WITH STUDENT ID AND RECORD ID
      const record = await RecordModel.findOne({
        RID: req.params.studentId,
        _id: req.params.id,
      });

      if (!record)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        record,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // GET ALL RECORDS OF THE STUDENT
  GET_RECORDS: async (req, res) => {
    try {

      const student = await Student.findOne({
        _id : req.params.studentId
      }).select('_id')  
      
      if(!student) return res.status(401).json({msg: "Forbidden!"})

      const records = await RecordModel.find({
        student: req.params.studentId,
      });

      if (records.length == 0)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        records,
      });
    } catch (error) {
      console.error(error);
    }
  },

  GET_RECORD: async (req, res) => {
    try {
      const record = await RecordModel.findOne({
        _id: req.params.id,
      })
        .populate({
          path: "student",
          select: "-password -__v -records",
        })
        .populate({
          path: "remark_by_warden.by",
          select: "firstname lastname contact _id adminIs",
          model: "admin",
        })
        .populate({
          path: "approval.sent_for_approval_by",
          select: "firstname lastname contact email",
          model: "admin",
        })
        .populate({
          path: "approval.accepted_by",
          select: "firstname lastname contact email",
          model: "admin",
        })
        .populate({
          path: "approval.declined_by",
          select: "firstname lastname contact email",
          model: "admin",
        });

      if (!record)
        return res
          .status(404)
          .json({ msg: "No Records Found", success: false });

      res.json({
        success: true,
        record,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // APPLY FOR NEW LEAVE FORM
  REQUEST_NEW_RECORD: async (req, res) => {
    try {
      // CHECKIN IF THE DEVICE ID IS PROVIDED
      const device = req.header("x-device-id");
      if (!device)
        return res.status(403).json({ msg: "Forbidden!", success: false });

      let record = ({ from, to, reason, destination, RID, student } = req.body);
      record.device_id = device;
      // VALIDATING THE RECORD
      const { error } = VALIDATE_RECORD(record);
      if (error)
        return res.status(400).json({
          msg: error.details[0].message,
        });

      // NEW RECORD
      let leave = new RecordModel(record);

      // SAVING THE RECORD
      const result = await leave.save();
      res.status(200).json({
        msg: "Request Sent.. wait for the approval",
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  },

  // CANCEL REQUEST FOR APPROVAL
  CANCEL_REQUEST: async (req, res) => {
    try {
      const result = await RecordModel.findByIdAndRemove({
        _id: req.params.id,
      });
      if (!result)
        return res
          .status(404)
          .json({ msg: "Operation Failed! Please Try Again", success: false });
      res.status(200).json({
        msg: "Request Cancelled!",
        success: true,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // UPDATE STATUS
  UPDATE_STATUS: async (req, res) => {
    try {
      const status = req.query.status;

      // finding the document and performing update
      let record = await RecordModel.updateOne(
        {
          _id: req.params.id,
        },
        { status }
      );

      record = await RecordModel.findOne({ _id: req.params.id });
      if (!record)
        return res
          .status(404)
          .json({ msg: "Operation Failed! Please Try Again", success: false });

      // record = await record.save();

      // MARKING ON CHECKLIST IF ACCEPTED BY WARDEN
      if (record.status === "ACCEPTED") {
        // checking if user already present in checklist
        const found = await Checklist.findOne({
          student: record.student,
          record: record._id,
        });

        // console.log("user found in the checklist : ", found)

        // if not in the list add to the list
        if (!found) {
          // console.log("Adding user to the checklist")
          const checklist = await new Checklist({
            student: record.student,
            record: record._id,
          });
          await checklist.save();
        }
      }

      res.status(200).json({
        msg: record.status,
        success: true,
      });
    } catch (error) {
      console.error(error);
    }
  },

  ADD_REMARK: async (req, res) => {
    try {
      // reason for declinin the application
      const msg = req.body.msg;
      // declined by id of  [ warden : id, hod : id ]
      let by = req.body.by;

      // check if the admin / user exists
      const admin = await Admin.findOne({
        _id: by,
      }).select("_id adminIs");

      if (!admin)
        return res
          .status(404)
          .json({ msg: "Operation Failed! Please Try Again", success: false });

      // check if the record is valid
      record = await RecordModel.findOne({ _id: req.params.id });
      if (!record)
        return res
          .status(404)
          .json({ msg: "Operation Failed! Please Try Again", success: false });

      switch (admin.adminIs) {
        case "WARDEN":
          await RecordModel.updateOne(
            {
              _id: req.params.id,
            },
            {
              "remark_by_warden.msg": msg,
              "remark_by_warden.by": by,
            }
          );
          res.status(200).json({
            success: true,
            msg: "Warden has added the remark",
          });
          break;
        // case "HOD":
        //   await RecordModel.updateOne(
        //     {
        //       _id: req.params.id,
        //     },
        //     {
        //       "remark_by_hod.msg": msg,
        //       "remark_by_hod.by": by,
        //     }
        //   );
        //   res.status(200).json({
        //     success: true,
        //     msg: "HOD has added the remark",
        //   });

        //   break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  REQUEST_APPROVAL: async (req, res) => {
    try {
      const { recordId, wardenId } = req.body;

      // check if the record exists
      let record = await RecordModel.findOne({ _id: recordId });

      if (!record)
        return res
          .status(404)
          .json({ mag: "record not found!", success: false });

      // update the record
      const result = await RecordModel.updateOne(
        { _id: recordId },
        {
          "approval.sent_for_approval": true,
          "approval.sent_for_approval_by": wardenId,
        }
      );

      res.status(200).json({
        msg: "Requested for Approval",
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);
      res.json({
        error,
      });
    }
  },

  DECLINE_APPROVAL: async (req, res) => {
    try {
      // check if the admin is hod
      const { adminId, recordId, remark } = req.body;
      const admin = await Admin.findOne({ _id: adminId });
      if (!admin && admin.adminIs == "HOD")
        return res.status(403).json({ msg: "Forbidden!", success: false });

      // get record id
      let record = await RecordModel.findOne({ _id: recordId });
      console.log(record);
      if (!record)
        return res
          .status(404)
          .json({ msg: "record not found", success: false });

      // updating the record
      // update the approval status

      const result = await RecordModel.updateOne(
        { _id: recordId },
        {
          "approval.declined": true,
          "approval.declined_by": admin._id,
          "approval.remark": remark,
        }
      );

      res.status(200).json({
        msg: "Approval Declined",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  ACCEPT_APPROVAL: async (req, res) => {
    try {
      // check if the admin is hod
      const { adminId, recordId } = req.body;
      const admin = await Admin.findOne({ _id: adminId });
      if (!admin && admin.adminIs == "HOD")
        return res.status(403).json({ msg: "Forbidden!", success: false });

      // get record id
      const record = await RecordModel.findOne({ _id: recordId });
      if (!record)
        return res
          .status(404)
          .json({ msg: "Record not found", success: false });

      // updating the record
      // update the approval status

      await RecordModel.updateOne(
        { _id: recordId },
        {
          "approval.accepted": true,
          "approval.accepted_by": admin._id,
        }
      );

      res.status(200).json({
        msg: "Record Approved",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  ACCEPT_MULTI_RECORDS: async (req, res) => {
    try {
      // get admin id and check if operation is valid
      // record id's to be updated
      const adminId = req.headers['x-auth-check-admin'];      
      const admin = await Admin.findById(adminId);
      if(!admin ) return res.status(403).json({ msg : "Accesss Denied", success : false})     
      
      // // check
      const { recordIds } = req.body;
      
      let result = await RecordModel.find({
        _id : { $in : recordIds }
      });

      result = result.map(element => {
        return {
          record : element._id,
          student : element.student
        }
      }); 

      // perform update      
      const update = await RecordModel.updateMany(
        { _id: { $in: recordIds } },
        {
          $set: {
            "status": "ACCEPTED",                    
          },         
        },      
        { multi: true }  
      );    

      // chekc for existing record in the checkilsit 
      const found = await Checklist.find({
        record : { $in : recordIds }
      })     

      console.log("===========")
      console.log(found)
      console.log("===========")

      console.log(update.n === result.length && found.length === 0)

      if(update.n === result.length  && found.length === 0) {
        const checklist = await Checklist.insertMany(result)
        res.status(200).json({  
          success: true, 
          update,
          result,
          checklist   
        });
      }
      else return res.status(400).json({ msg : "Update Failed!", success : false })      

    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
