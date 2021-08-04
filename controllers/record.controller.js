const { json } = require('body-parser');
const { RecordModel, VALIDATE_RECORD } = require('../models/RecordModel');
const { Student } = require('../models/StudentModel');
const { Checklist } = require('../models/Checklist');

module.exports = {
    // LIST ALL LEAVE FORMS
    GET_ALL: async (req, res) => {
        try {
            const records = await RecordModel.find({});

            if (!records) return res.status(404).json({ msg: "No Records Found", success: false });

            res.json({
                success: true,
                records
            });

        } catch (error) {
            console.error(error)
        }
    },

    // LIST ALL LEAVE FORMS
    GET_STUDENT_RECORD: async (req, res) => {
        try {

            console.log(req.params.id, req.params.studentId)
            // FINDING RECORD WITH STUDENT ID AND RECORD ID 
            const record = await RecordModel
                .findOne({
                    RID: req.params.studentId,
                    _id: req.params.id
                });

            if (!record) return res.status(404).json({ msg: "No Records Found", success: false });

            res.json({
                success: true,
                record
            });
        } catch (error) {
            console.error(error)
        }
    },


    // GET ALL RECORDS OF THE STUDENT
    GET_RECORDS: async (req, res) => {
        try {

            const records = await RecordModel
                .find({
                    studentId: req.params.studentId,
                });

            if (records.length == 0) return res.status(404).json({ msg: "No Records Found", success: false });

            res.json({
                success: true,
                records
            });

        } catch (error) {
            console.error(error)
        }
    },

    GET_RECORD: async (req, res) => {
        try {

            const record = await RecordModel
                .findOne({
                    _id: req.params.id,
                }).populate({
                    path: 'studentId',
                    select: '-password -__V -records'
                })

            if (!record) return res.status(404).json({ msg: "No Records Found", success: false });

            res.json({
                success: true,
                record
            });

        } catch (error) {
            console.error(error)
        }
    },


    // APPLY FOR NEW LEAVE FORM
    REQUEST_NEW_RECORD: async (req, res) => {
        try {
            let record = { from, to, reason, destination, RID, studentId } = req.body;

            // VALIDATING THE RECORD
            const { error } = VALIDATE_RECORD(record);
            if (error) return res
                .status(400)
                .json({
                    msg: error.details[0].message
                })

            // NEW RECORD 
            let leave = new RecordModel(record);

            // SAVING THE RECORD
            const result = await leave.save();
            res
                .status(200)
                .json({
                    msg: "Request Sent.. wait for the approval",
                    success: true,
                    result
                })

        } catch (error) {
            console.error(error)
        }
    },

    // CANCEL REQUEST FOR APPROVAL
    CANCEL_REQUEST: async (req, res) => {
        try {
            const result = await RecordModel.findByIdAndRemove({
                _id: req.params.id
            })
            if (!result) return res.status(404).json({ msg: "Operation Failed! Please Try Again", success: false })
            res
                .status(200)
                .json({
                    msg: "Request Cancelled!",
                    success: true
                })

        } catch (error) {
            console.error(error)
        }
    },

    // UPDATE STATUS
    UPDATE_STATUS: async (req, res) => {
        try {
            const status = req.query.status;

            // finding the document and performing update 
            let record = await RecordModel.updateOne(
                {
                    _id: req.params.id
                },
                { status })

            record = await RecordModel.findOne({ _id: req.params.id })

            if (!record) return res.status(404).json({ msg: "Operation Failed! Please Try Again", success: false })

            // record = await record.save();

            // MARKING ON CHECKLIST IF ACCEPTED BY WARDEN
            if (record.status === "ACCEPTED") {

                // checking if user already present in checklist
                const found = await Checklist.findOne({
                    student: record.studentId,
                    record: record._id
                })

                // console.log("user found in the checklist : ", found)

                // if not in the list add to the list
                if (!found) {
                    // console.log("Adding user to the checklist")
                    const checklist = await new Checklist({
                        student: record.studentId,
                        record: record._id
                    })
                    await checklist.save()
                }
            }

            res
                .status(200)
                .json({
                    msg: record.status,
                    success: true,
                })

        } catch (error) {
            console.error(error)
        }
    }

}