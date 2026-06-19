const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    profession: { type: String, trim: true },
    bio: { type: String, trim: true },
    cv: {
      data: { type: Buffer },
      filename: { type: String },
      mimetype: { type: String },
      uploadedAt: { type: Date },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Users", versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
