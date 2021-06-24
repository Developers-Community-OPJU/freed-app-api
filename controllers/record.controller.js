const { json } = require('body-parser');
const { RecordModel, VALIDATE_RECORD } = require('../models/RecordModel');
const { Student } = require('../models/StudentModel');

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
                    RID: req.params.RID,
                    _id: req.params.recordId
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

            if (!records) return res.status(404).json({ msg: "No Records Found", success: false });

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
                .find({
                    RID: req.params.id,
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
    }

}