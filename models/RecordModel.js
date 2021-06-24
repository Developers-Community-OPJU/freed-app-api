const mongoose = require('mongoose');
const Joi = require('joi');


const RecordSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    RID: {
        type: String,
        trim: true,
        required: true
    },
    destination: {
        type: String,
        trim: true,
        required: true
    },
    reason: {
        type: String,
        trim: true,
        required: true
    },
    from: {
        type: Date,
        trim: true,
        required: true
    },
    to: {
        type: Date,
        trim: true,
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now()
    },
    permitted: {
        type: Boolean,
        default: false
    },
    HODRemark: {
        type: String,
        trim: true
    }
});

// VALIDATING STUDENT SCHEMA - ON LOGIN
function VALIDATE_RECORD(record) {
    const schema = Joi.object({
        RID: Joi.string().required(),
        studentId: Joi.required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        destination: Joi.string().required(),
        reason: Joi.string().max(200).required()
    });
    return schema.validate(record);
}


const RecordModel = new mongoose.model("records", RecordSchema)

module.exports = { RecordModel, VALIDATE_RECORD }