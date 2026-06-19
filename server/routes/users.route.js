const express  = require("express");
const bcrypt   = require("bcryptjs");
const multer   = require("multer");
const User     = require("../models/userSchema");
const { requireUser } = require("../middleware/authMiddleware");

const router  = express.Router();
const storage = multer.memoryStorage(); // שמירה בזיכרון ואז העברה ל-DB
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("קובץ חייב להיות PDF או Word"));
  },
});

// ─── קבלת פרופיל ────────────────────────────────────────────────────────────
router.get("/me", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -cv.data");
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── עדכון פרופיל ────────────────────────────────────────────────────────────
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

// ─── שינוי סיסמה ─────────────────────────────────────────────────────────────
router.put("/me/password", requireUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ error: "סיסמה נוכחית שגויה" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "סיסמה עודכנה בהצלחה" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── העלאת קורות חיים ────────────────────────────────────────────────────────
router.post("/me/cv", requireUser, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "קובץ לא הועלה" });
    await User.findByIdAndUpdate(req.userId, {
      $set: {
        "cv.data":       req.file.buffer,
        "cv.filename":   req.file.originalname,
        "cv.mimetype":   req.file.mimetype,
        "cv.uploadedAt": new Date(),
      },
    });
    res.json({ message: "קורות חיים הועלו בהצלחה", filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── הורדת קורות חיים ────────────────────────────────────────────────────────
router.get("/me/cv", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.cv?.data) return res.status(404).json({ error: "לא נמצאו קורות חיים" });
    res.set("Content-Type", user.cv.mimetype);
    res.set("Content-Disposition", `inline; filename="${user.cv.filename}"`);
    res.send(user.cv.data);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── מחיקת קורות חיים ────────────────────────────────────────────────────────
router.delete("/me/cv", requireUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $unset: { cv: 1 } });
    res.json({ message: "קורות חיים נמחקו" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

module.exports = router;
