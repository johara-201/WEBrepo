//This file defines the User model

const mongoose = require("mongoose");

//Create the schema for registered users
const userSchema = new mongoose.Schema(
  {
    //User email address
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    //Encrypted user password
    password: { type: String, required: true },

    //User full name
    name: { type: String, required: true, trim: true },

    //User phone number
    phone: { type: String, trim: true },

    //User city
    city: { type: String, trim: true },

    //User profession or job title
    profession: { type: String, trim: true },

    //Short description about the user
    bio: { type: String, trim: true },

    //Store the uploaded CV file
    cv: {
      //File content
      data: { type: Buffer },

      //Original file name
      filename: { type: String },

      //File type
      mimetype: { type: String },

      //Date when the CV was uploaded
      uploadedAt: { type: Date },

       iv: String,
       isEncrypted: {type: Boolean, default: false,},
    },

    //Token for password reset (cleared after use)
    resetToken: { type: String },
    resetExpires: { type: Date },

    //Save the account creation date
    createdAt: { type: Date, default: Date.now },
  },

  //Save the data in the "Users" collection
  { collection: "Users", versionKey: false }
);

//Export the User model
module.exports = mongoose.model("User", userSchema);