const express  = require("express");
const bcrypt   = require("bcryptjs");
const Admin    = require("../models/adminSchema");
const { requireAdmin, requireSuper } = require("../middleware/authMiddleware");

const router = express.Router();

// ─── קבלת פרופיל מנהל נוכחי ─────────────────────────────────────────────────
router.get("/me", requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) return res.status(404).json({ error: "מנהל לא נמצא" });
    res.json(admin);
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── עדכון שם משתמש וסיסמה (כל מנהל עבור עצמו) ─────────────────────────────
router.put("/me", requireAdmin, async (req, res) => {
  try {
    const { username, email, newPassword, currentPassword } = req.body;
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ error: "מנהל לא נמצא" });

    // בדיקת סיסמה נוכחית (אלא אם זה שינוי סיסמה ראשוני כפוי)
    if (!admin.mustChangePassword && currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.password);
      if (!match) return res.status(400).json({ error: "סיסמה נוכחית שגויה" });
    }

    // בדיקה שהשם לא כבר תפוס
    if (username && username !== admin.username) {
      const taken = await Admin.findOne({ username });
      if (taken) return res.status(400).json({ error: "שם משתמש כבר תפוס" });
    }

    if (username) admin.username = username;
    if (email)    admin.email    = email;
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 10);
    admin.mustChangePassword = false;
    await admin.save();

    res.json({ message: "פרטים עודכנו בהצלחה" });
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── רשימת כל המנהלים (super בלבד) ─────────────────────────────────────────
router.get("/", requireSuper, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
    res.json(admins);
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── הוספת מנהל חדש (super בלבד) ────────────────────────────────────────────
router.post("/", requireSuper, async (req, res) => {
  try {
    // יצירת שם משתמש וסיסמה אקראיים
    const randomUser = "admin_" + Math.random().toString(36).slice(2, 8);
    const randomPass = Math.random().toString(36).slice(2, 10) + "A1!";
    const hashed     = await bcrypt.hash(randomPass, 10);

    const admin = await Admin.create({
      username: randomUser,
      password: hashed,
      role: "admin",
      canSeeAll: false,
      createdBy: req.adminId,
      mustChangePassword: true,
    });

    // מחזירים את הסיסמה בטקסט פעם אחת בלבד (המנהל יצטרך לשנות)
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

// ─── מחיקת מנהל (super בלבד, לא מוחקים את עצמנו) ───────────────────────────
router.delete("/:id", requireSuper, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.adminId)) {
      return res.status(400).json({ error: "לא ניתן למחוק את עצמך" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "מנהל נמחק" });
  } catch {
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

module.exports = router;
