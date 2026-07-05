//This file defines the Application model

const mongoose = require("mongoose");

//Create the schema for job applications
const applicationSchema = new mongoose.Schema(
  {
    //The job that the user applied for
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      required: true,
    },

    //Save the job title even if the job is deleted later
    jobTitle: {
      type: String,
    },

    //Registered user ID (optional)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    //Admin who created the job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    //Applicant full name
    fullName: {
      type: String,
      required: true,
    },

    //Applicant email
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    //Preferred language for email notifications
    preferredLanguage: {
      type: String,
      enum: ["he", "ar"],
      default: "he",
    },

    //Applicant phone number
    phone: {
      type: String,
    },

    //Optional message from the applicant
    message: {
      type: String,
    },

    //Date when the application was submitted
    submittedAt: {
      type: Date,
      default: Date.now,
    },

    //Save a copy of the CV at the time of the application
    cvSnapshot: {
      data: {
        type: Buffer,
      },
      filename: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      uploadedAt: {
        type: Date,
      },
      iv: String,
      isEncrypted: {
        type: Boolean,
        default: false,
      },
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

    //Status of a job update that the candidate needs to review
    jobUpdateStatus: {
      type: String,
      enum: ["none", "pending_review", "still_relevant", "not_relevant"],
      default: "none",
    },

    //When the related job was updated
    jobUpdatedAt: {
      type: Date,
    },

    //List of changes that were made to the related job
    jobChanges: [
      {
        field: String,
        label: String,
        oldValue: String,
        newValue: String,
      },
    ],

    //When the user reviewed the updated job details
    jobUpdateReviewedAt: {
      type: Date,
    },
  },

  //Save the data in the "Applications" collection
  {
    collection: "Applications",
    versionKey: false,
  }
);

//Prevent duplicate applications for the same job by the same registered user.
//This protects the system even if two requests arrive at the exact same time.
applicationSchema.index(
  { jobId: 1, userId: 1 },
  {
    unique: true,
    name: "unique_application_per_job_user",
    partialFilterExpression: {
      userId: { $type: "objectId" },
    },
  }
);

//Prevent duplicate applications for the same job by the same email.
//This protects registered users and guest users.
applicationSchema.index(
  { jobId: 1, email: 1 },
  {
    unique: true,
    name: "unique_application_per_job_email",
    partialFilterExpression: {
      email: { $type: "string" },
    },
  }
);

//Export the Application model
module.exports = mongoose.model("Applications", applicationSchema);