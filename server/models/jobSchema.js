//This file defines the Job model

const mongoose = require("mongoose");

//Create the schema for job postings
let Job = new mongoose.Schema(
  {
    //Job title
    title: { type: String },

    //Organization that offers the job
    organization: { type: String },

    //Job location
    city: { type: String },

    //Job category or role
    jobType: { type: String },

    //Employment percentage
    employmentPercent: { type: Number },

    //Estimated travel time in minutes
    distanceMinutes: { type: Number },

    //Check if the job is suitable for students
    suitableForStudents: { type: Boolean },

    //Job description
    description: { type: String },

    //Job source (manual or external)
    source: { type: String },

    //Name of the job source
    sourceName: { type: String },

    //External application link
    applyUrl: { type: String },

    //Job publish date
    publishDate: { type: Date },

    //Save which admin created the job
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

    //Type of organization
    organizationType: { type: String },

    //Check if the job came from an external source
    isExternal: { type: Boolean, default: false },

    //Version number for optimistic locking.
    //Every update increases this number by one, so two admins
    //cannot overwrite each other's changes without noticing.
    version: { type: Number, default: 0 },
  },

  //Save the data in the "Jobs" collection
  { collection: "Jobs", versionKey: false }
);

//Export the Job model
module.exports = mongoose.model("Jobs", Job);