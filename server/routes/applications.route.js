//This file handles job applications

const express = require("express");
const router = express.Router();

const Application = require("../models/applicationSchema");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");
const Job = require("../models/jobSchema");
const multer = require("multer");
const User = require("../models/userSchema");
const { encryptCv, decryptCv } = require("../utils/cvEncryption");

//Store uploaded CV files in memory
const allowedCvTypes = [
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedCvExtensions = [".pdf", ".doc", ".docx"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const ext = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    const mimeOk = allowedCvTypes.includes(file.mimetype);
    const extOk = allowedCvExtensions.includes(ext);

    if (mimeOk || extOk) {
      cb(null, true);
    } else {
      cb(new Error("קובץ קורות חיים חייב להיות PDF או Word"));
    }
  },
});

//Normalize email before saving/searching
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

//Remove the CV file buffer before sending data back to the frontend
function removeCvData(application) {
  const result =
    typeof application.toObject === "function"
      ? application.toObject()
      : { ...application };

  if (result.cvSnapshot) {
    delete result.cvSnapshot.data;
  }

  return result;
}

//Return a duplicate application message by language
function duplicateApplicationMessage(language = "he") {
  return language === "ar"
    ? "لقد قمتِ/قمتَ بالتقديم لهذه الوظيفة مسبقًا."
    : "כבר הגשת מועמדות למשרה הזו.";
}

//Check if this is a MongoDB duplicate key error
function isDuplicateKeyError(error) {
  return error && error.code === 11000;
}

//Create a new job application
router.post("/", upload.single("resumeFile"), async (req, res) => {
  let preferredLanguage = "he";

  try {
    //Copy all form data from the request body
    const data = { ...req.body };

    //Save the preferred language for future email notifications
    preferredLanguage = data.preferredLanguage === "ar" ? "ar" : "he";
    data.preferredLanguage = preferredLanguage;

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
        //Invalid token is ignored because guest application is allowed
      }
    }

    //Normalize email before every DB operation
    data.email = normalizeEmail(data.email);

    //If the user uploaded a CV, save a copy of it in this application
    if (req.file) {
      const encryptedCv = encryptCv(req.file.buffer);

      data.cvSnapshot = {
        data: encryptedCv.encryptedBuffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
        iv: encryptedCv.iv,
        isEncrypted: true,
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

    //Check if this user or email already applied to this job.
    //This prevents duplicates before saving.
    const duplicateConditions = [];

    if (data.userId) {
      duplicateConditions.push({ userId: data.userId });
    }

    if (data.email) {
      duplicateConditions.push({ email: data.email });
    }

    const existingApplication = await Application.findOne({
      jobId: data.jobId,
      $or: duplicateConditions,
    }).select("-cvSnapshot.data");

    if (existingApplication) {
      //If the old application was cancelled, reuse the same document instead of creating a duplicate.
      if (existingApplication.cancelledByUser) {
        existingApplication.set({
          ...data,
          submittedAt: new Date(),
          cancelledByUser: false,
          cancelledAt: null,
          hiddenFromAdmin: false,
          jobRemoved: false,
          removedJobTitle: "",
          removedJobAt: null,
          jobUpdateStatus: "none",
          jobUpdatedAt: null,
          jobChanges: [],
          jobUpdateReviewedAt: null,
        });

        await existingApplication.save();

        return res.status(200).json(removeCvData(existingApplication));
      }

      return res.status(409).json({
        error: duplicateApplicationMessage(preferredLanguage),
        application: removeCvData(existingApplication),
      });
    }

    //Save the new application.
    //The unique indexes in applicationSchema also protect this line from race conditions.
    const application = new Application(data);
    await application.save();

    return res.status(201).json(removeCvData(application));
  } catch (error) {
    //Handle duplicate index errors from MongoDB.
    //This is the important protection when two requests arrive at the exact same time.
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        error: duplicateApplicationMessage(preferredLanguage),
      });
    }

    return res.status(500).json({
      error: "שגיאה בשליחת מועמדות",
      details: error.message,
    });
  }
});

//Create a new application automatically from the logged-in user's profile
router.post("/auto/:jobId", requireUser, async (req, res) => {
  let preferredLanguage = "he";

  try {
    const jobId = req.params.jobId;

    //Save the preferred language for future email notifications
    preferredLanguage = req.body.preferredLanguage === "ar" ? "ar" : "he";

    //Find the logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        error:
          preferredLanguage === "ar"
            ? "لم يتم العثور على المستخدم"
            : "משתמש לא נמצא",
      });
    }

    //Auto apply requires a CV saved in the user's profile
    if (!user.cv?.data) {
      return res.status(400).json({
        error:
          preferredLanguage === "ar"
            ? "لاستخدام التقديم التلقائي يجب رفع السيرة الذاتية في الحساب الشخصي."
            : "כדי להשתמש בהגשה אוטומטית צריך להעלות קורות חיים באזור האישי.",
      });
    }

    //Make sure the user has basic profile details
    if (!user.name || !user.email) {
      return res.status(400).json({
        error:
          preferredLanguage === "ar"
            ? "تنقص بعض التفاصيل في الحساب الشخصي. تأكدي من وجود الاسم الكامل والبريد الإلكتروني."
            : "חסרים פרטים בפרופיל. ודאי שיש שם מלא ואימייל באזור האישי.",
      });
    }

    //Find the selected job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        error:
          preferredLanguage === "ar"
            ? "الوظيفة غير موجودة أو تم حذفها"
            : "המשרה לא קיימת או נמחקה",
      });
    }

    const email = normalizeEmail(user.email);

    //Prevent duplicate application for the same job before saving.
    const existingApplication = await Application.findOne({
      jobId,
      $or: [{ userId: req.userId }, { email }],
    }).select("-cvSnapshot.data");

    if (existingApplication) {
      //If an old cancelled application exists, reactivate it instead of creating a duplicate.
      if (existingApplication.cancelledByUser) {
        const reactivatedApplication = await Application.findByIdAndUpdate(
          existingApplication._id,
          {
            jobId,
            jobTitle: job.title,
            postedBy: job.postedBy,
            userId: req.userId,
            fullName: user.name,
            email,
            phone: user.phone || "",
            preferredLanguage,
            message:
              preferredLanguage === "ar"
                ? "تقديم تلقائي عبر النظام"
                : "הגשה אוטומטית דרך המערכת",
            cvSnapshot: {
              data: user.cv.data,
              filename: user.cv.filename,
              mimetype: user.cv.mimetype,
              uploadedAt: user.cv.uploadedAt || new Date(),
              iv: user.cv.iv,
              isEncrypted: user.cv.isEncrypted,
            },
            submittedAt: new Date(),
            cancelledByUser: false,
            cancelledAt: null,
            hiddenFromAdmin: false,
            jobRemoved: false,
            removedJobTitle: "",
            removedJobAt: null,
            jobUpdateStatus: "none",
            jobUpdatedAt: null,
            jobChanges: [],
            jobUpdateReviewedAt: null,
          },
          { new: true, runValidators: true }
        ).select("-cvSnapshot.data");

        return res.status(200).json(reactivatedApplication);
      }

      return res.status(409).json({
        error: duplicateApplicationMessage(preferredLanguage),
        application: removeCvData(existingApplication),
      });
    }

    //Create application automatically from user profile.
    //The unique indexes in applicationSchema also protect this save from race conditions.
    const application = new Application({
      jobId,
      jobTitle: job.title,
      postedBy: job.postedBy,

      userId: req.userId,
      fullName: user.name,
      email,
      phone: user.phone || "",

      preferredLanguage,

      message:
        preferredLanguage === "ar"
          ? "تقديم تلقائي عبر النظام"
          : "הגשה אוטומטית דרך המערכת",

      cvSnapshot: {
        data: user.cv.data,
        filename: user.cv.filename,
        mimetype: user.cv.mimetype,
        uploadedAt: user.cv.uploadedAt || new Date(),
        iv: user.cv.iv,
        isEncrypted: user.cv.isEncrypted,
      },
    });

    await application.save();

    return res.status(201).json(removeCvData(application));
  } catch (error) {
    //Handle duplicate index errors from MongoDB.
    //This catches the case where auto apply and manual apply happen at the same time.
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        error: duplicateApplicationMessage(preferredLanguage),
      });
    }

    return res.status(500).json({
      error: "שגיאה בהגשה האוטומטית",
      details: error.message,
    });
  }
});

//Get applications for admins
router.get("/", requireAdmin, async (req, res) => {
  try {
    //Super admins see all applications, regular admins see only their own
    const query = req.canSeeAll ? {} : { postedBy: req.adminId };

    const applications = await Application.find(query)
      .select("-cvSnapshot.data")
      .sort({
        submittedAt: -1,
      });

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
    })
      .select("-cvSnapshot.data")
      .sort({ submittedAt: -1 });

    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get all applications for a specific job
router.get("/job/:jobId", requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    })
      .select("-cvSnapshot.data")
      .sort({
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
      return res.status(404).json({
        error: "לא נמצאו קורות חיים למועמדות זו",
      });
    }

    //Set the file type before sending the CV
    res.set("Content-Type", application.cvSnapshot.mimetype);

    //Open the CV in the browser
    res.set(
      "Content-Disposition",
      `inline; filename="${application.cvSnapshot.filename}"`
    );

    const fileBuffer =
      application.cvSnapshot.isEncrypted && application.cvSnapshot.iv
        ? decryptCv(application.cvSnapshot.data, application.cvSnapshot.iv)
        : application.cvSnapshot.data;

    res.send(fileBuffer);
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
      updateData.email = normalizeEmail(req.body.email);
    }

    //Update phone only if it was sent
    if (req.body.phone !== undefined) {
      updateData.phone = req.body.phone;
    }

    //Update message only if it was sent
    if (req.body.message !== undefined) {
      updateData.message = req.body.message;
    }

    //Update preferred language only if it was sent
    if (req.body.preferredLanguage !== undefined) {
      updateData.preferredLanguage =
        req.body.preferredLanguage === "ar" ? "ar" : "he";
    }

    //Replace the CV if a new file was uploaded
    if (req.file) {
      const encryptedCv = encryptCv(req.file.buffer);

      updateData.cvSnapshot = {
        data: encryptedCv.encryptedBuffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
        iv: encryptedCv.iv,
        isEncrypted: true,
      };
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-cvSnapshot.data");

    if (!updatedApplication) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        error: "כבר קיימת מועמדות למשרה הזו.",
      });
    }

    res.status(500).json({
      error: "שגיאה בעדכון המועמדות",
      details: error.message,
    });
  }
});

//Candidate confirms whether an updated job is still relevant
router.patch("/:id/job-update-response", requireUser, async (req, res) => {
  try {
    const { stillRelevant } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "המועמדות לא נמצאה" });
    }

    if (String(application.userId) !== String(req.userId)) {
      return res.status(403).json({ error: "אין הרשאה" });
    }

    if (stillRelevant) {
      application.jobUpdateStatus = "still_relevant";
      application.jobUpdateReviewedAt = new Date();
      application.cancelledByUser = false;
      application.cancelledAt = null;

      await application.save();

      return res.status(200).json(removeCvData(application));
    }

    application.jobUpdateStatus = "not_relevant";
    application.jobUpdateReviewedAt = new Date();
    application.cancelledByUser = true;
    application.cancelledAt = new Date();

    await application.save();

    return res.status(200).json({
      message: "המועמדות סומנה כלא רלוונטית והוסרה מהרשימה",
    });
  } catch (error) {
    res.status(500).json({
      error: "שגיאה בעדכון סטטוס המועמדות",
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

        if (decoded.type === "user") {
          userId = decoded.id;
        }
      } catch {
        //Invalid token
      }
    }

    if (!userId) {
      return res.status(401).send("אין הרשאה");
    }

    //Find the application that should be cancelled
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).send("לא נמצא");
    }

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

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "קובץ קורות החיים גדול מדי. ניתן להעלות קובץ עד 5MB.",
      });
    }

    return res.status(400).json({
      message: "שגיאה בהעלאת קובץ קורות החיים.",
    });
  }

  if (err.message === "קובץ קורות חיים חייב להיות PDF או Word") {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
});

//Export the applications router
module.exports = router;