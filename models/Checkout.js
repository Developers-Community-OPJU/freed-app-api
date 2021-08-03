const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
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

const Checkout = new mongoose.model("checkout", CheckoutSchema)

module.exports = { Checkout }