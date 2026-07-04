//This file handles login, registration, and first admin setup

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Application = require("../models/applicationSchema");
const { sendPasswordResetEmail } = require("../services/emailService");

//Connect old guest applications to the user after register or login
async function claimGuestApplications(userId, email) {
  await Application.updateMany(
    { email, userId: { $exists: false } },
    { $set: { userId } }
  );
}

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";

//Check if the system needs first admin setup
router.get("/admin/needs-setup", async (req, res) => {
  const count = await Admin.countDocuments();
  res.json({ needsSetup: count === 0 });
});

//Register a new job seeker
router.post("/register", async (req, res) => {
  try {
    //Get user data from the request body
    const { email, password, name, phone } = req.body;

    //Check required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: "שם, אימייל וסיסמה הם שדות חובה" });
    }

    //Check if this email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "אימייל כבר רשום"
      });
    }

    //Encrypt the password before saving it
    const hashed = await bcrypt.hash(password, 10);

    //Create the new user in the database
    const user = await User.create({ email, password: hashed, name, phone });

    //Create a token for the logged-in user
    const token = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });

    //Connect guest applications with the same email to this user
    await claimGuestApplications(user._id, user.email);

    //Send the token and user details to the client
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        profession: user.profession || "",
        bio: user.bio || "",
        hasCv: !!user.cv?.filename,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Login a job seeker
router.post("/login", async (req, res) => {
  try {
    //Get login data from the request body
    const { email, password } = req.body;

    //Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "אימייל או סיסמה שגויים" });

    //Compare the typed password with the encrypted password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "אימייל או סיסמה שגויים" });

    //Create a token for the logged-in user
    const token = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });

    //Connect guest applications with the same email to this user
    await claimGuestApplications(user._id, user.email);

    //Send the token and user details to the client
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        profession: user.profession || "",
        bio: user.bio || "",
        hasCv: !!user.cv?.filename,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Login an admin
router.post("/admin/login", async (req, res) => {
  try {
    //Get admin login data from the request body
    const { username, password } = req.body;

    //Find the admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "שם משתמש או סיסמה שגויים" });

    //Compare the typed password with the encrypted password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "שם משתמש או סיסמה שגויים" });

    //Create a token with admin permissions
    const token = jwt.sign(
      { id: admin._id, type: "admin", role: admin.role, canSeeAll: admin.canSeeAll },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    //Send the token and admin details to the client
    res.json({
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        role: admin.role,
        canSeeAll: admin.canSeeAll,
        mustChangePassword: admin.mustChangePassword,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Create the first two super admins only if there are no admins in the database
router.post("/admin/setup", async (req, res) => {
  try {
    //Count how many admins already exist
    const count = await Admin.countDocuments();

    //Stop setup if admins already exist
    if (count > 0) return res.status(403).json({ error: "הגדרה ראשונית כבר בוצעה" });

    //Get the two super admin accounts from the request body
    const { username, password, secondUsername, secondPassword } = req.body;

    //Check that all setup fields were sent
    if (!username || !password || !secondUsername || !secondPassword) {
      return res.status(400).json({ error: "שדות חסרים" });
    }

    //Encrypt both passwords before saving them
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(secondPassword, 10);

    //Create the two super admin accounts
    await Admin.insertMany([
      { username, password: hash1, role: "super", canSeeAll: true },
      { username: secondUsername, password: hash2, role: "super", canSeeAll: true },
    ]);

    res.status(201).json({ message: "שני מנהלים ראשיים נוצרו בהצלחה" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── Password reset – users ──────────────────────────────────────────────────

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "נדרש אימייל" });

    const user = await User.findOne({ email });

    // Always respond with success to avoid revealing whether the email exists
    if (!user) return res.json({ message: "אם האימייל רשום במערכת, ישלח אליו קישור לאיפוס" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}?resetToken=${token}&type=user`;

    await sendPasswordResetEmail(email, resetUrl, req.body.language || "he");

    res.json({ message: "אם האימייל רשום במערכת, ישלח אליו קישור לאיפוס" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "חסרים פרטים" });
    if (newPassword.length < 6) return res.status(400).json({ error: "סיסמה חייבת להכיל לפחות 6 תווים" });

    const user = await User.findOne({ resetToken: token, resetExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: "הקישור לאיפוס פג תוקף או לא תקין" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── Password reset – admins ─────────────────────────────────────────────────

router.post("/admin/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "נדרש שם משתמש" });

    const admin = await Admin.findOne({ username });

    if (!admin || !admin.email) {
      return res.json({ message: "אם שם המשתמש נמצא ויש לו אימייל, ישלח קישור לאיפוס" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    admin.resetToken = token;
    admin.resetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await admin.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}?resetToken=${token}&type=admin`;

    await sendPasswordResetEmail(admin.email, resetUrl, req.body.language || "he");

    res.json({ message: "אם שם המשתמש נמצא ויש לו אימייל, ישלח קישור לאיפוס" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

router.post("/admin/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "חסרים פרטים" });
    if (newPassword.length < 6) return res.status(400).json({ error: "סיסמה חייבת להכיל לפחות 6 תווים" });

    const admin = await Admin.findOne({ resetToken: token, resetExpires: { $gt: new Date() } });
    if (!admin) return res.status(400).json({ error: "הקישור לאיפוס פג תוקף או לא תקין" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = undefined;
    admin.resetExpires = undefined;
    await admin.save();

    res.json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Export the auth router
module.exports = router;