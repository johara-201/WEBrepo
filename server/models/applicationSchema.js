const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
    jobTitle: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // מחפש עבודה מחובר (אופציונלי)
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // מנהל שפרסם את המשרה
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    message: { type: String },
    submittedAt: { type: Date, default: Date.now },
    cvSnapshot: {data: { type: Buffer }, filename: { type: String }, mimetype: { type: String }, uploadedAt: { type: Date }},
    jobRemoved: {
      type: Boolean,
      default: false,
    },

    hiddenFromAdmin: {
      type: Boolean,
      default: false,
    },

    removedJobTitle: {
      type: String,
      default: "",
    },

    removedJobAt: {
      type: Date,
    },

    cancelledByUser: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
    },
  },
  { collection: "Applications", versionKey: false }
);

applicationSchema.index(
  { jobId: 1, userId: 1 },
  { unique: true, sparse: true }
);

applicationSchema.index(
  { jobId: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model("Applications", applicationSchema);
