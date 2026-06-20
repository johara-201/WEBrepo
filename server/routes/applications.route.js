const express     = require("express");
const router      = express.Router();
const Application = require("../models/applicationSchema");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");

// ─── POST - הגשת מועמדות (עם או בלי כניסה) ──────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const data = { ...req.body };
    // אם יש Authorization header של משתמש רשום, נשמור userId
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";
        const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
        if (decoded.type === "user") data.userId = decoded.id;
      } catch {} // token לא חובה
    }
    const application = new Application(data);
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ─── GET - כל המועמדויות (מנהל) ─────────────────────────────────────────────
router.get("/", requireAdmin, async (req, res) => {
  try {
    const query = req.canSeeAll ? {} : { postedBy: req.adminId };
    const applications = await Application.find(query).sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ─── GET - מועמדויות של משתמש מחובר ─────────────────────────────────────────
router.get("/my", requireUser, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId, cancelledByUser: { $ne: true } })
      .sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ─── GET - מועמדויות לפי משרה (מנהל) ─────────────────────────────────────────
router.get("/job/:jobId", requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ─── DELETE - הסרת מועמדות ───────────────────────────────────────────────────
// משתמש רשום מוחק מועמדות שלו עצמו
router.delete("/:id", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    let userId = null;
    if (auth?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";
        const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
        if (decoded.type === "user") userId = decoded.id;
      } catch {}
    }

    if (!userId) return res.status(401).send("אין הרשאה");

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).send("לא נמצא");
    if (String(app.userId) !== String(userId)) {
      return res.status(403).send("אין הרשאה");
    }

    await Application.findByIdAndUpdate(req.params.id, {
      cancelledByUser: true,
      cancelledAt: new Date(),
    });
    res.status(200).send("מועמדות בוטלה");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
