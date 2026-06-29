//This file defines the Admin model

const mongoose = require("mongoose");

//Create the schema for admin accounts
const adminSchema = new mongoose.Schema(
  {
    //Admin username
    username: { type: String, required: true, unique: true, trim: true },

    //Admin email address
    email: { type: String, trim: true, lowercase: true },

    //Encrypted admin password
    password: { type: String, required: true },

    //Admin role: super admin or regular admin
    role: { type: String, enum: ["super", "admin"], default: "admin" },

    //Decide if the admin can view all jobs and applications
    canSeeAll: { type: Boolean, default: false },

    //Save which admin created this account
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

    //Force the admin to change the password after the first login
    mustChangePassword: { type: Boolean, default: false },

    //Save the account creation date
    createdAt: { type: Date, default: Date.now },
  },

  //Save the data in the "Admins" collection
  { collection: "Admins", versionKey: false }
);

//Export the Admin model
module.exports = mongoose.model("Admin", adminSchema);