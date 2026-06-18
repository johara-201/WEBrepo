const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
    jobTitle: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "Applications", versionKey: false }
);

module.exports = mongoose.model("Applications", applicationSchema);
