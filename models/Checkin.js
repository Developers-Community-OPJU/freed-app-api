const mongoose = require('mongoose');

const CheckinSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "records",
        required: true
    }
}, { timestamps: true });

const Checkin = new mongoose.model("checkin", CheckinSchema)

module.exports = { Checkin }