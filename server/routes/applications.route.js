const express = require("express");
const router = express.Router();
const Application = require("../models/applicationSchema");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/jobSchema");
const multer = require("multer");
const User = require("../models/userSchema");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("resumeFile"), async (req, res) => {
  try {
    const data = { ...req.body };

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
      }
    }

    if (req.file && data.userId) {
      const cvData = {
        data: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
      };

      await User.findByIdAndUpdate(data.userId, {
        $set: { cv: cvData },
      });

      data.cvSnapshot = cvData;
    }

    if (!req.file && data.userId) {
      const user = await User.findById(data.userId);

      if (user?.cv?.data) {
        data.cvSnapshot = user.cv;
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

router.get("/", requireAdmin, async (req, res) => {
  try {
    const query = req.canSeeAll ? {} : { postedBy: req.adminId };
    const applications = await Application.find(query).sort({ submittedAt: -1 });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/my", requireUser, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
      cancelledByUser: { $ne: true },
    }).sort({ submittedAt: -1 });

    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/job/:jobId", requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId }).sort({
      submittedAt: -1,
    });

    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id/cv", requireUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    if (String(application.userId) !== String(req.userId)) {
      return res.status(403).json({ error: "אין הרשאה" });
    }

    if (!application.cvSnapshot?.data) {
      return res.status(404).json({ error: "לא נמצאו קורות חיים למועמדות זו" });
    }

    res.set("Content-Type", application.cvSnapshot.mimetype);
    res.set(
      "Content-Disposition",
      `inline; filename="${application.cvSnapshot.filename}"`
    );

    res.send(application.cvSnapshot.data);
  } catch (error) {
    res.status(500).json({ error: "שגיאה בטעינת קורות החיים" });
  }
});

router.get("/:id/cv", requireUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    if (String(application.userId) !== String(req.userId)) {
      return res.status(403).json({ error: "אין הרשאה" });
    }

    if (!application.cvSnapshot?.data) {
      return res.status(404).json({ error: "לא נמצאו קורות חיים למועמדות זו" });
    }

    res.set("Content-Type", application.cvSnapshot.mimetype);
    res.set(
      "Content-Disposition",
      `inline; filename="${application.cvSnapshot.filename}"`
    );

    res.send(application.cvSnapshot.data);
  } catch (error) {
    res.status(500).json({ error: "שגיאה בטעינת קורות החיים" });
  }
});

router.put("/:id", upload.single("resumeFile"), async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email?.trim().toLowerCase(),
      phone: req.body.phone,
      message: req.body.message,
      updatedAt: new Date(),
    };

    if (req.file) {
      const cvData = {
        data: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
      };

      updateData.cvSnapshot = cvData;

      const existingApplication = await Application.findById(req.params.id);

      if (existingApplication?.userId) {
        await User.findByIdAndUpdate(existingApplication.userId, {
          $set: { cv: cvData },
        });
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
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