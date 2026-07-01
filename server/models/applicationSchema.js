//This file defines the Application model

const mongoose = require("mongoose");

//Create the schema for job applications
const applicationSchema = new mongoose.Schema(
  {
    //The job that the user applied for
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },

    //Save the job title even if the job is deleted later
    jobTitle: { type: String },

    //Registered user ID (optional)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    //Admin who created the job
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

    //Applicant full name
    fullName: { type: String, required: true },

    //Applicant email
    email: { type: String, required: true, lowercase: true, trim: true },

    //Preferred language for email notifications
    preferredLanguage: {
      type: String,
      enum: ["he", "ar"],
      default: "he",
    },

    //Applicant phone number
    phone: { type: String },

    //Optional message from the applicant
    message: { type: String },

    //Date when the application was submitted
    submittedAt: { type: Date, default: Date.now },

    //Save a copy of the CV at the time of the application
    cvSnapshot: {
      data: { type: Buffer },
      filename: { type: String },
      mimetype: { type: String },
      uploadedAt: { type: Date },
    },

    //Check if the related job was removed
    jobRemoved: {
      type: Boolean,
      default: false,
    },

    //Hide the application from the admin if needed
    hiddenFromAdmin: {
      type: Boolean,
      default: false,
    },

    //Keep the job title after the job is deleted
    removedJobTitle: {
      type: String,
      default: "",
    },

    //Save when the job was removed
    removedJobAt: {
      type: Date,
    },

    //Check if the user cancelled the application
    cancelledByUser: {
      type: Boolean,
      default: false,
    },

    //Save when the application was cancelled
    cancelledAt: {
      type: Date,
    },
  },

  //Save the data in the "Applications" collection
  { collection: "Applications", versionKey: false }
);

//Prevent the same logged-in user from applying twice
applicationSchema.index(
  { jobId: 1, userId: 1 },
  { unique: true, sparse: true }
);

//Prevent the same email from applying twice to the same job
applicationSchema.index(
  { jobId: 1, email: 1 },
  { unique: true }
);

//Export the Application model
module.exports = mongoose.model("Applications", applicationSchema);