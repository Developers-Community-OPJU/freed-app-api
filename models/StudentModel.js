const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

// STUDENT MODEL
const Student_Schema = new mongoose.Schema({
    RID: { type: String, required: true, unique: true, trim: true, minlength: 6, maxlength: 255 },
    password: { type: String, bcrypt: true, minlength: 8, maxlength: 1024, required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    branch: { type: String },
    course: { type: String },
    semester: { type: Number },
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'records'
    }]
}, { timestamps: true });

// VALIDATING STUDENT SCHEMA - ON REGISTRATION
function VALIDATE_REGISTER(user) {
    const schema = Joi.object({
        RID: Joi.string().required(),
        password: Joi.string().required().min(6).max(1024)
    });

    return schema.validate(user);
}

// VALIDATING STUDENT SCHEMA - ON LOGIN
function VALIDATE_LOGIN(user) {
    const schema = Joi.object({
        RID: Joi.string().required(),
        password: Joi.string().required().min(6).max(1024)
    });

    return schema.validate(user);
}

Student_Schema.methods.generateAuthToken = function () {
    const token = jwt.sign({ RID: this.RID, id: this._id }, config.get("jwtPrivateKey"))
    return token;
}

const Student = new mongoose.model('students', Student_Schema)

module.exports = {
    Student,
    VALIDATE_REGISTER,
    VALIDATE_LOGIN
}