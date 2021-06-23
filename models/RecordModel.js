const mongoose = require('mongoose');
const joi = require('joi')


const RecordSchema = new mongoose.Schema({
    RID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
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


const RecordModel = new mongoose.model("records", RecordSchema)

module.exports = { RecordModel }