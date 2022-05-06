const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// STUDENT MODEL
const Admin_Schema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    bcrypt: true,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: { type: String, trim: true, unique: true },
  contact: { type: Number, trim: true },
  adminIs: {
    type: String,
    enum: ["HOD", "WARDEN", "COMMON", "SUPER"],
    default: "WARDEN",
  },
  department: {
    type: String,
    enum: ["HR1", "HR2", "HR3", "CSE", "MECH", "META", "EEE", "COMMON"],
    required: true,
  },
});

// VALIDATING ADMIN SCHEMA - ON LOGIN
function VALIDATE_REGISTER(user) {
  const schema = Joi.object({
    employeeCode: Joi.string().required(),
    password: Joi.string().required().min(6).max(1024),
    firstname: Joi.string().required(),
    lastname: Joi.string(),
    email: Joi.string().email().required(),
    contact: Joi.number().required(),
    adminIs: Joi.string().required(),
    department: Joi.string().required(),
  });

  return schema.validate(user);
}

// VALIDATING ADMIN SCHEMA - REGISTER
function VALIDATE_LOGIN(user) {
  const schema = Joi.object({
    employeeCode: Joi.string().required(),
    password: Joi.string().required().min(6).max(1024),
  });

  return schema.validate(user);
}

Admin_Schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { employeeCode: this.employeeCode, _id: this._id, adminIs: this.adminIs },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Admin = new mongoose.model("admin", Admin_Schema);

module.exports = {
  Admin,
  VALIDATE_LOGIN,
  VALIDATE_REGISTER,
};
