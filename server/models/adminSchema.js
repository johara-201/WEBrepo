const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, required: true },
    // super = יארה + רכזת משאבי אנוש | admin = מנהל רגיל
    role: { type: String, enum: ["super", "admin"], default: "admin" },
    // super רואה הכל, admin רגיל רואה רק מה שהוא יצר
    canSeeAll: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    mustChangePassword: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Admins", versionKey: false }
);

module.exports = mongoose.model("Admin", adminSchema);
