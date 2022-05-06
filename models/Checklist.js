const mongoose = require("mongoose");

const ChecklistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    record: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "records",
      required: true,
    },
  },
  { timestamps: true }
);

const Checklist = new mongoose.model("checklist", ChecklistSchema);

module.exports = { Checklist };
