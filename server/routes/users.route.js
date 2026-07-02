//This file handles user profile and CV management

const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const User = require("../models/userSchema");
const { requireUser } = require("../middleware/authMiddleware");
const { encryptCv, decryptCv } = require("../utils/cvEncryption");

const router = express.Router();

//Store uploaded files in memory before saving them to the database
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  //Limit uploaded file size to 5MB
  limits: { fileSize: 5 * 1024 * 1024 },

  //Allow only PDF and Word files
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("קובץ חייב להיות PDF או Word"));
  },
});

//Get the logged-in user's profile
router.get("/me", requireUser, async (req, res) => {
  try {
    //Do not return the password or CV file
    const user = await User.findById(req.userId).select("-password -cv.data");

    if (!user)
      return res.status(404).json({ error: "משתמש לא נמצא" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Update the logged-in user's profile
router.put("/me", requireUser, async (req, res) => {
  try {
    const { name, phone, city, profession, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, phone, city, profession, bio } },
      { new: true, select: "-password -cv.data" }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Change the user's password
router.put("/me/password", requireUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);

    //Check that the current password is correct
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match)
      return res.status(400).json({ error: "סיסמה נוכחית שגויה" });

    //Encrypt the new password before saving it
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ message: "סיסמה עודכנה בהצלחה" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Upload a new CV
router.post("/me/cv", requireUser, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "קובץ לא הועלה" });

    //Encrypt the uploaded CV before saving it in the database
    const encryptedCv = encryptCv(req.file.buffer);

    await User.findByIdAndUpdate(req.userId, {
      $set: {
        "cv.data": encryptedCv.encryptedBuffer,
        "cv.filename": req.file.originalname,
        "cv.mimetype": req.file.mimetype,
        "cv.uploadedAt": new Date(),
        "cv.iv": encryptedCv.iv,
        "cv.isEncrypted": true,
      },
    });

    res.json({
      message: "קורות חיים הועלו בהצלחה",
      filename: req.file.originalname,
    });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Download the user's CV
router.get("/me/cv", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user?.cv?.data)
      return res.status(404).json({ error: "לא נמצאו קורות חיים" });

    //Set the file type before sending it
    res.set("Content-Type", user.cv.mimetype);

    //Open the file in the browser
    res.set(
      "Content-Disposition",
      `inline; filename="${user.cv.filename}"`
    );

    const fileBuffer =
      user.cv.isEncrypted && user.cv.iv
        ? decryptCv(user.cv.data, user.cv.iv)
        : user.cv.data;

    res.send(fileBuffer);
  
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Delete the user's CV
router.delete("/me/cv", requireUser, async (req, res) => {
  try {
    //Remove the CV from the user's profile
    await User.findByIdAndUpdate(req.userId, {
      $unset: { cv: 1 },
    });

    res.json({ message: "קורות חיים נמחקו" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

//Export the users router
module.exports = router;