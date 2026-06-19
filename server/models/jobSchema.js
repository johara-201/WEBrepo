const mongoose = require("mongoose");

let Job = new mongoose.Schema(
  {
    title: { type: String },
    organization: { type: String },
    city: { type: String },
    jobType: { type: String },
    employmentPercent: { type: Number },
    distanceMinutes: { type: Number },
    suitableForStudents: { type: Boolean },
    description: { type: String },
    source: { type: String },
    sourceName: { type: String },
    applyUrl: { type: String },
    publishDate: { type: Date },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // מנהל שפרסם
  },
  { collection: "Jobs", versionKey: false }
);

module.exports = mongoose.model("Jobs", Job);