//This file handles admin profile actions and super admin management

const express = require("express");
const bcrypt = require("bcryptjs");

const Admin = require("../models/adminSchema");
const { requireAdmin, requireSuper } = require("../middleware/authMiddleware");

const router = express.Router();

//Get the current admin profile
router.get("/me", requireAdmin, async (req, res) => {
  try {
    //Find the logged-in admin without returning the password
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) return res.status(404).json({ error: "מנהל לא נמצא" });

    res.json(admin);
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Update username, email, or password for the current admin
router.put("/me", requireAdmin, async (req, res) => {
  try {
    //Get the updated admin data from the request body
    const { username, email, newPassword, currentPassword } = req.body;

    //Find the logged-in admin
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ error: "מנהל לא נמצא" });

    //Check current password, unless this is the first forced password change
    if (!admin.mustChangePassword && currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.password);
      if (!match) return res.status(400).json({ error: "סיסמה נוכחית שגויה" });
    }

    //Make sure the new username is not already taken
    if (username && username !== admin.username) {
      const taken = await Admin.findOne({ username });
      if (taken) return res.status(400).json({ error: "שם משתמש כבר תפוס" });
    }

    //Update only the fields that were sent
    if (username) admin.username = username;
    if (email) admin.email = email;

    //Encrypt the new password before saving it
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 10);

    //After update, the admin no longer has to change password
    admin.mustChangePassword = false;

    await admin.save();

    res.json({ message: "פרטים עודכנו בהצלחה" });
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Get all admins. Only super admins can do this
router.get("/", requireSuper, async (req, res) => {
  try {
    //Return all admins without passwords, newest first
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });

    res.json(admins);
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Create a new regular admin. Only super admins can do this
router.post("/", requireSuper, async (req, res) => {
  try {
    //Create a random username and temporary password
    const randomUser = "admin_" + Math.random().toString(36).slice(2, 8);
    const randomPass = Math.random().toString(36).slice(2, 10) + "A1!";

    //Encrypt the temporary password before saving it
    const hashed = await bcrypt.hash(randomPass, 10);

    //Save the new admin in the database
    const admin = await Admin.create({
      username: randomUser,
      password: hashed,
      role: "admin",
      canSeeAll: false,
      createdBy: req.adminId,
      mustChangePassword: true,
    });

    //Return the temporary password only once
    res.status(201).json({
      message: "מנהל חדש נוצר",
      credentials: { username: randomUser, password: randomPass },
      adminId: admin._id,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: "שם משתמש כבר קיים, נסה שוב" });
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Delete an admin, Only super admins can do this
router.delete("/:id", requireSuper, async (req, res) => {
  try {
    //Prevent a super admin from deleting their own account
    if (String(req.params.id) === String(req.adminId)) {
      return res.status(400).json({ error: "לא ניתן למחוק את עצמך" });
    }

    //Delete the selected admin
    await Admin.findByIdAndDelete(req.params.id);

    res.json({ message: "מנהל נמחק" });
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Export the admin management router
module.exports = router;