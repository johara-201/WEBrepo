const express     = require("express");
const router      = express.Router();
const Application = require("../models/applicationSchema");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/jobSchema");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("resumeFile"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
  data.resumeFile = req.file.filename;
}

    const auth = req.headers.authorization;

    if (auth?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";
        const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);

        if (decoded.type === "user") {
          data.userId = decoded.id;
        }
      } catch {
        // משתמש לא מחובר עדיין יכול להגיש מועמדות
      }
    }

    const job = await Job.findById(data.jobId);

    if (!job) {
      return res.status(404).json({
        error: "המשרה לא קיימת או נמחקה",
      });
    }

    data.jobTitle = job.title;
    data.postedBy = job.postedBy;
    data.email = data.email?.trim().toLowerCase();

    const duplicateQuery = data.userId
      ? { jobId: data.jobId, userId: data.userId, cancelledByUser: { $ne: true } }
      : { jobId: data.jobId, email: data.email, cancelledByUser: { $ne: true } };

    const existingApplication = await Application.findOne(duplicateQuery);

    if (existingApplication) {
      return res.status(409).json({
        error: "כבר הגשת מועמדות למשרה הזו. ניתן לעדכן פרטים במקום לשלוח שוב.",
        application: existingApplication,
      });
    }

    const application = new Application(data);
    await application.save();

    res.status(201).send(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "כבר קיימת מועמדות למשרה הזו.",
      });
    }

    res.status(500).json({
      error: "שגיאה בשליחת מועמדות",
      details: error.message,
    });
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

router.put("/:id", upload.single("resumeFile"), async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        fullName: req.body.fullName,
        email: req.body.email?.trim().toLowerCase(),
        phone: req.body.phone,
        message: req.body.message,
        ...(req.file && { resumeFile: req.file.filename }),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      error: "שגיאה בעדכון המועמדות",
      details: error.message,
    });
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
