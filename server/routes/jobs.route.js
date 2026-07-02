//This file handles jobs, job statistics, and job import actions

const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const Job = require("../models/jobSchema");
const Application = require("../models/applicationSchema");
const User = require("../models/userSchema");
const { requireAdmin } = require("../middleware/authMiddleware");

const {
  notifyApplicantsJobDeleted,
  notifyApplicantsJobUpdated,
} = require("../services/emailService");

//Default URL for the curated local jobs feed
const CURATED_LOCAL_FEED_URL =
  process.env.CURATED_LOCAL_FEED_URL ||
  "http://localhost:3000/api/jobs/curated-feed-data";

//Get all jobs from the database
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get jobs for admin dashboard
router.get("/admin/list", requireAdmin, async (req, res) => {
  try {
    const filter = req.canSeeAll ? {} : { postedBy: req.adminId };

    const jobs = await Job.find(filter).sort({ publishDate: -1 });

    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).json({ error: "שגיאה בשליפת משרות למנהל" });
  }
});

//Get site statistics for the About page
router.get("/stats/summary", async (req, res) => {
  try {
    //Count all jobs in the database
    const activeJobs = await Job.countDocuments({});

    //Count registered users
    const registeredUsers = await User.countDocuments({});

    //Count all applications
    const applications = await Application.countDocuments({});

    //Get all unique organizations
    const organizations = await Job.distinct("organization");

    //Get all unique cities
    const cities = await Job.distinct("city");

    res.status(200).json({
      activeJobs,
      organizations: organizations.filter(Boolean).length,
      registeredUsers,
      applications,
      cities: cities.filter(Boolean).length,
    });
  } catch (error) {
    res.status(500).json({ error: "שגיאה בשליפת נתוני האתר" });
  }
});

//Get curated local jobs from a JSON file
router.get("/curated-feed-data", async (req, res) => {
  try {
    //Build the path to the local JSON file
    const filePath = path.join(__dirname, "../data/beit-hakerem-jobs.json");

    //Read the JSON file as text
    const raw = await fs.promises.readFile(filePath, "utf-8");

    //Convert the JSON text into JavaScript data
    const jobs = JSON.parse(raw);

    res.json(jobs);
  } catch (error) {
    res.status(500).send({ error: "שגיאה בקריאת קובץ המשרות" });
  }
});

//Create a new job
router.post("/", requireAdmin, async (req, res) => {
  try {
    //Create a new job from the request body
    const job = new Job({
      ...req.body,
      postedBy: req.adminId,
      source: req.body.source || "manual",
    });

    //Save the job in the database
    await job.save();

    //Notify connected clients that statistics changed
    req.app.get("broadcastStatsUpdate")?.();

    res.status(201).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Update an existing job
router.put("/:id", requireAdmin, async (req, res) => {  
  try {
    //Save the old job before updating, so we can compare what changed
    const oldJob = await Job.findById(req.params.id);

    if (!oldJob) {
      return res.status(404).send("Job not found");
    }

    if (!req.canSeeAll && String(oldJob.postedBy) !== String(req.adminId)) {
      return res.status(403).json({ error: "אין הרשאה לערוך משרה של מנהל אחר" });
    }

    //Update the job and return the new version
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    //Find applicants who applied to this job
    const applications = await Application.find({
      jobId: req.params.id,
      cancelledByUser: { $ne: true },
      email: { $exists: true, $ne: "" },
    }).select("fullName email preferredLanguage");

    //Send email update to the applicants
    await notifyApplicantsJobUpdated(applications, oldJob, job);

    //Notify connected clients that statistics changed
    req.app.get("broadcastStatsUpdate")?.();

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Delete a job
router.delete("/:id", requireAdmin, async (req, res) => {  
  try {
    //Find the selected job before deleting it
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    if (!req.canSeeAll && String(job.postedBy) !== String(req.adminId)) {
      return res.status(403).json({ error: "אין הרשאה למחוק משרה של מנהל אחר" });
    }

    //Find applicants before deleting the job
    const applications = await Application.find({
      jobId: req.params.id,
      cancelledByUser: { $ne: true },
      email: { $exists: true, $ne: "" },
    }).select("fullName email preferredLanguage");

    //Delete the selected job from the database
    await Job.findByIdAndDelete(req.params.id);

    //Do not delete applications, so users can still see that the job was removed
    await Application.updateMany(
      { jobId: req.params.id },
      {
        $set: {
          jobRemoved: true,
          removedJobTitle: job.title,
          removedJobAt: new Date(),
        },
      }
    );

    //Send email notification to applicants
    await notifyApplicantsJobDeleted(applications, job);

    //Notify connected clients that statistics changed
    req.app.get("broadcastStatsUpdate")?.();

    res.status(200).send("Job deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get one job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

//List of job sources that the system can check
const JOB_SOURCES = [
  //Local authorities
  {
    sourceName: "עיריית כרמיאל",
    organizationType: "רשות מקומית",
    city: "כרמיאל",
    url: "https://www.karmiel.muni.il",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "עיריית סח'נין",
    organizationType: "רשות מקומית",
    city: "סח'נין",
    url: "https://www.sakhnin.muni.il",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "מג'ד אלכרום",
    organizationType: "רשות מקומית",
    city: "מג'ד אלכרום",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "דיר אל אסד",
    organizationType: "רשות מקומית",
    city: "דיר אל אסד",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "בענה",
    organizationType: "רשות מקומית",
    city: "בענה",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "נחף",
    organizationType: "רשות מקומית",
    city: "נחף",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "ראמה",
    organizationType: "רשות מקומית",
    city: "ראמה",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "סאג'ור",
    organizationType: "רשות מקומית",
    city: "סאג'ור",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "שעב",
    organizationType: "רשות מקומית",
    city: "שעב",
    url: "",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "מועצה אזורית משגב",
    organizationType: "רשות מקומית",
    city: "משגב",
    url: "https://www.misgav.org.il",
    isDirectFetchSupported: false,
  },

  //Government and organization sources
  {
    sourceName: "נציבות שירות המדינה",
    organizationType: "ממשלתי",
    region: "ארצי",
    url: "https://ejobs.gov.il",
    isDirectFetchSupported: false,
  },
  {
    sourceName: 'החברה למתנ"סים',
    organizationType: 'מתנ"ס',
    region: "ארצי",
    url: "https://www.matnasim.org.il",
    isDirectFetchSupported: false,
  },
  {
    sourceName: "AllJobs",
    organizationType: "לוח דרושים",
    region: "ארצי",
    url: "https://www.alljobs.co.il",
    isDirectFetchSupported: false,
  },

  //Remotive is a real external API used to show the import flow
  {
    sourceName: "Remotive",
    organizationType: "API חיצוני להדגמה",
    region: "global",
    url: "https://remotive.com/api/remote-jobs?limit=50",
    isDirectFetchSupported: true,
  },
];

//Categories that are not relevant to this project
const BLOCKED_CATEGORIES = new Set([
  "software development",
  "data",
  "data and analytics",
  "sales",
  "marketing",
  "design",
  "devops / sysadmin",
  "product management",
  "finance / legal",
  "customer service",
  "writing",
  "artificial intelligence",
  "qa",
  "all others",
  "medical",
  "accounting",
  "hr",
]);

//Check if a job is relevant to education, youth, or community
function isRelevantJob(titleAndCategory) {
  if (!titleAndCategory) return false;

  //Convert the text to lowercase to make the search easier
  const t = String(titleAndCategory).toLowerCase();

  //Block jobs from categories that are not relevant
  for (const cat of BLOCKED_CATEGORIES) {
    if (t.includes(cat)) return false;
  }

  //Keywords that match the project topic
  const keywords = [
    "מדריך",
    "מדריכה",
    "רכז",
    "רכזת",
    "מנחה",
    "מנהל תוכנית",
    "מנהלת תוכנית",
    "מנהל תכנית",
    "מנהלת תכנית",
    "עובד נוער",
    "עובדת נוער",
    "קידום נוער",
    "נוער",
    "חינוך",
    "חינוכי",
    "חינוך בלתי פורמלי",
    "הדרכה",
    "קהילה",
    "קהילתי",
    'מתנ"ס',
    "מרכז קהילתי",
    "מרכז קהילה",
    "עמותה",
    "מנהיגות",
    "מעורבות חברתית",
    "רווחה",
    "ילדים",
    "צעירים",
    "מחלקת נוער",
    "תנועת נוער",
    "ארגון נוער",
    "youth worker",
    "youth coordinator",
    "youth program",
    "youth leader",
    "youth development",
    "youth educator",
    "youth outreach",
    "community coordinator",
    "community outreach",
    "community educator",
    "community organizer",
    "community development",
    "social worker",
    "social work",
    "outreach coordinator",
    "outreach worker",
    "program coordinator",
    "program educator",
    "program facilitator",
    "education coordinator",
    "education specialist",
    "education program",
    "informal education",
    "non-profit",
    "welfare worker",
    "civic engagement",
    "education",
    "teaching",
    "teacher",
    "tutor",
    "instructor",
    "training",
    "learning",
    "community",
    "social",
    "nonprofit",
    "ngo",
    "youth",
    "children",
    "coordinator",
    "program",
    "content",
    "writing",
  ];

  //Return true if at least one keyword appears in the job text
  return keywords.some((k) => t.includes(k));
}

//Decide if the source should be filtered by area
function shouldFilterArea(source) {
  return source.region !== "global";
}

//Check if the job location is relevant to the project area
function isRelevantArea(text) {
  //If there is no area data, do not block the job
  if (!text) return true;

  const t = String(text).toLowerCase();

  //Areas that are relevant to Beit HaKerem and the north
  const areas = [
    "כרמיאל",
    "סחנין",
    "סח'נין",
    "מג'ד אלכרום",
    "מגד אלכרום",
    "דיר אל אסד",
    "דיר אלאסד",
    "בענה",
    "נחף",
    "ראמה",
    "סאגור",
    "סאג'ור",
    "שעב",
    "משגב",
    "צפון",
    "גליל",
    "בית הכרם",
    "אשכול בית הכרם",
    "worldwide",
    "anywhere",
    "global",
    "remote",
    "israel",
  ];

  //Return true if the area text contains one of the allowed areas
  return areas.some((a) => t.includes(a.toLowerCase()));
}

//Remove HTML tags from text
function stripHtml(html) {
  if (!html) return "";

  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//Convert a Remotive job into our Job structure
function mapRemotiveJob(job) {
  return {
    title: job.title,
    organization: job.company_name,
    city: job.candidate_required_location || "לא צוין",
    jobType: job.category,
    description: stripHtml(job.description).slice(0, 1000),
    source: "external-local",
    sourceName: "Remotive - API demo",
    organizationType: "API חיצוני להדגמה",
    applyUrl: job.url,
    publishDate: job.publication_date
      ? new Date(job.publication_date)
      : new Date(),
    isExternal: true,
  };
}

//Import jobs from external sources that support direct fetch
router.post("/import-local-sources", async (req, res) => {
  const jobsToSave = [];
  const skippedSources = [];
  let checkedSources = 0;

  //Go over all defined job sources
  for (const source of JOB_SOURCES) {
    //Sources without API support are skipped and saved for the response
    if (!source.isDirectFetchSupported || !source.url) {
      skippedSources.push({
        sourceName: source.sourceName,
        url: source.url,
        reason: "דורש בדיקה ידנית (אין API)",
      });
      continue;
    }

    try {
      checkedSources++;

      //Fetch jobs from the source URL
      const response = await fetch(source.url);

      //Skip the source if the response failed
      if (!response.ok) {
        skippedSources.push({
          sourceName: source.sourceName,
          url: source.url,
          reason: `סטטוס ${response.status}`,
        });
        continue;
      }

      //Make sure the response is JSON
      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        skippedSources.push({
          sourceName: source.sourceName,
          url: source.url,
          reason: "התשובה אינה JSON (כנראה דף HTML)",
        });
        continue;
      }

      //Read the jobs from the response
      const data = await response.json();
      const rawJobs = data.jobs || data.data || [];

      //Map and filter jobs before saving them
      for (const j of rawJobs) {
        if (jobsToSave.length >= 10) break;

        const mapped = mapRemotiveJob(j);
        const haystack = `${mapped.title} ${mapped.jobType}`;
        const passesArea = shouldFilterArea(source)
          ? isRelevantArea(mapped.city)
          : true;

        if (isRelevantJob(haystack) && passesArea) {
          jobsToSave.push(mapped);
        }
      }
    } catch {
      skippedSources.push({
        sourceName: source.sourceName,
        url: source.url,
        reason: "שגיאה בשליפה",
      });
    }
  }

  try {
    //Remove old imported jobs from this source
    await Job.deleteMany({ source: "external-local" });

    //Save the new imported jobs
    const saved = await Job.insertMany(jobsToSave);

    //Notify connected clients that statistics changed
    req.app.get("broadcastStatsUpdate")?.();

    res.status(200).send({
      imported: saved.length,
      checkedSources,
      skippedSources,
      jobs: saved,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Import jobs from the curated local feed
router.post("/import-curated-local-feed", async (req, res) => {
  try {
    //Fetch jobs from the curated feed URL
    const response = await fetch(CURATED_LOCAL_FEED_URL);

    if (!response.ok) {
      return res.status(502).send({
        error: `שגיאה בשליפה ממאגר החיצוני: סטטוס ${response.status}`,
      });
    }

    //Read the jobs from the response
    const rawJobs = await response.json();

    if (!Array.isArray(rawJobs)) {
      return res.status(502).send({
        error: "המאגר החיצוני לא החזיר מערך משרות תקין",
      });
    }

    //Convert the feed jobs into the project Job structure
    const mappedJobs = rawJobs
      .filter(
        (job) =>
          job.title ||
          job.organization ||
          job.city ||
          job.description ||
          job.applyUrl
      )
      .map((job) => ({
        title: job.title || "",
        organization: job.organization || "",
        city: job.city || "",
        jobType: job.jobType || "",
        employmentPercent: parseInt(job.positionPercent) || null,
        suitableForStudents: job.studentFriendly || false,
        description: job.description || "",
        applyUrl: job.applyUrl || "",
        source: "curated-local-feed",
        sourceName: job.sourceName || "מאגר חיצוני - משרות בית הכרם",
        organizationType: job.organizationType || "מקור מקומי",
        isExternal: true,
        publishDate: job.publishDate ? new Date(job.publishDate) : new Date(),
      }));

    //Remove old curated feed jobs before inserting the new ones
    await Job.deleteMany({ source: "curated-local-feed" });

    //Save the curated feed jobs
    const saved = await Job.insertMany(mappedJobs);

    //Notify connected clients that statistics changed
    req.app.get("broadcastStatsUpdate")?.();

    res.status(200).send({ imported: saved.length, jobs: saved });
  } catch (error) {
    res.status(500).send({ error: "שגיאה בייבוא ממאגר חיצוני" });
  }
});

module.exports = router;