const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    fcm_token: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const DeviceModel = new mongoose.model("records", DeviceSchema);

module.exports = { DeviceModel };
