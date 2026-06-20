const express      = require("express");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
const User         = require("../models/userSchema");
const Admin        = require("../models/adminSchema");
const Application  = require("../models/applicationSchema");

async function claimGuestApplications(userId, email) {
  await Application.updateMany(
    { email, userId: { $exists: false } },
    { $set: { userId } }
  );
}

const router    = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";

// ─── בדיקה אם צריך הגדרה ראשונית ────────────────────────────────────────────
router.get("/admin/needs-setup", async (req, res) => {
  const count = await Admin.countDocuments();
  res.json({ needsSetup: count === 0 });
});

// ─── רישום מחפש עבודה ───────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "שם, אימייל וסיסמה הם שדות חובה" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "אימייל כבר רשום" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ email, password: hashed, name, phone });
    const token  = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });
    await claimGuestApplications(user._id, user.email);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── כניסה מחפש עבודה ───────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "אימייל או סיסמה שגויים" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "אימייל או סיסמה שגויים" });

    const token = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });
    await claimGuestApplications(user._id, user.email);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
});

// ─── כניסה מנהל ─────────────────────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "שם משתמש או סיסמה שגויים" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "שם משתמש או סיסמה שגויים" });

    const token = jwt.sign(
      { id: admin._id, type: "admin", role: admin.role, canSeeAll: admin.canSeeAll },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
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

// ─── הגדרת מנהל ראשי (רק אם אין מנהלים ב-DB) ──────────────────────────────
router.post("/admin/setup", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: "הגדרה ראשונית כבר בוצעה" });

    const { username, password, secondUsername, secondPassword } = req.body;
    if (!username || !password || !secondUsername || !secondPassword) {
      return res.status(400).json({ error: "שדות חסרים" });
    }

    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(secondPassword, 10);

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

module.exports = router;
