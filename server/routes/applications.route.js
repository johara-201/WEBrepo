//This file handles job applications

const express = require("express");
const router = express.Router();

const Application = require("../models/applicationSchema");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/jobSchema");
const multer = require("multer");
const User = require("../models/userSchema");

//Store uploaded CV files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//Create a new job application
router.post("/", upload.single("resumeFile"), async (req, res) => {
  try {
    //Copy all form data from the request body
    const data = { ...req.body };

    //Check if the request has a user token
    const auth = req.headers.authorization;

    if (auth?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";

        //Read the user data from the token
        const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);

        //If the token belongs to a user, connect the application to this user
        if (decoded.type === "user") {
          data.userId = decoded.id;
        }
      } catch {
      }
    }

    //If the user uploaded a CV, save a copy of it in this application
    if (req.file) {
      data.cvSnapshot = {
        data: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
      };
    }

    //If no new CV was uploaded, use the CV saved in the user profile
    if (!req.file && data.userId) {
      const user = await User.findById(data.userId);

      if (user?.cv?.data) {
        data.cvSnapshot = user.cv;
      }
    }

    //Find the job that the user applied for
    const job = await Job.findById(data.jobId);

    if (!job) {
      return res.status(404).json({
        error: "המשרה לא קיימת או נמחקה",
      });
    }

    //Save job details inside the application
    data.jobTitle = job.title;
    data.postedBy = job.postedBy;
    data.email = data.email?.trim().toLowerCase();

    //Check duplicates by user ID if logged in, or by email if guest
    const duplicateQuery = data.userId
      ? { jobId: data.jobId, userId: data.userId, cancelledByUser: { $ne: true } }
      : { jobId: data.jobId, email: data.email, cancelledByUser: { $ne: true } };

    //Check if this user or email already applied to this job
    const existingApplication = await Application.findOne(duplicateQuery);

    if (existingApplication) {
      return res.status(409).json({
        error: "כבר הגשת מועמדות למשרה הזו. ניתן לעדכן פרטים במקום לשלוח שוב.",
        application: existingApplication,
      });
    }

    //Save the new application
    const application = new Application(data);
    await application.save();

    res.status(201).send(application);
  } catch (error) {
    //Handle duplicate index errors from MongoDB
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

//Get applications for admins
router.get("/", requireAdmin, async (req, res) => {
  try {
    //Super admins see all applications, regular admins see only their own
    const query = req.canSeeAll ? {} : { postedBy: req.adminId };

    const applications = await Application.find(query).sort({ submittedAt: -1 });

    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get the logged-in user's active applications
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

//Get all applications for a specific job
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

//Get the CV file for a specific application
router.get("/:id/cv", requireUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    //Make sure the logged-in user owns this application
    if (String(application.userId) !== String(req.userId)) {
      return res.status(403).json({ error: "אין הרשאה" });
    }

    if (!application.cvSnapshot?.data) {
      return res.status(404).json({ error: "לא נמצאו קורות חיים למועמדות זו" });
    }

    //Set the file type before sending the CV
    res.set("Content-Type", application.cvSnapshot.mimetype);

    //Open the CV in the browser
    res.set(
      "Content-Disposition",
      `inline; filename="${application.cvSnapshot.filename}"`
    );

    res.send(application.cvSnapshot.data);
  } catch (error) {
    res.status(500).json({ error: "שגיאה בטעינת קורות החיים" });
  }
});

//Update an existing application
router.put("/:id", requireUser, upload.single("resumeFile"), async (req, res) => {
  try {
    const existingApplication = await Application.findById(req.params.id);

    if (!existingApplication) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    //Make sure the logged-in user owns this application
    if (String(existingApplication.userId) !== String(req.userId)) {
      return res.status(403).json({ error: "אין הרשאה לעדכן מועמדות זו" });
    }

    //Prepare only the fields that should be updated
    const updateData = {
      updatedAt: new Date(),
    };

    //Update full name only if it was sent
    if (req.body.fullName !== undefined) {
      updateData.fullName = req.body.fullName;
    }

    //Update email only if it was sent
    if (req.body.email !== undefined) {
      updateData.email = req.body.email.trim().toLowerCase();
    }

    //Update phone only if it was sent
    if (req.body.phone !== undefined) {
      updateData.phone = req.body.phone;
    }

    //Update message only if it was sent
    if (req.body.message !== undefined) {
      updateData.message = req.body.message;
    }

    //Replace the CV if a new file was uploaded
    if (req.file) {
      updateData.cvSnapshot = {
        data: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
      };
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

//Cancel an application
router.delete("/:id", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    let userId = null;

    //Read the user ID from the token
    if (auth?.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";
        const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
        if (decoded.type === "user") userId = decoded.id;
      } catch {}
    }

    if (!userId) return res.status(401).send("אין הרשאה");

    //Find the application that should be cancelled
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).send("לא נמצא");

    //Make sure the logged-in user owns this application
    if (String(app.userId) !== String(userId)) {
      return res.status(403).send("אין הרשאה");
    }

    //Do not delete the application, only mark it as cancelled
    await Application.findByIdAndUpdate(req.params.id, {
      cancelledByUser: true,
      cancelledAt: new Date(),
    });

    res.status(200).send("מועמדות בוטלה");
  } catch (error) {
    res.status(500).send(error);
  }
});

//Export the applications router
module.exports = router;