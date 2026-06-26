const express = require("express");
const router = express.Router();
const fs   = require("fs");
const path = require("path");

const Job = require("../models/jobSchema");
const Application = require("../models/applicationSchema");
const User = require("../models/userSchema");

const CURATED_LOCAL_FEED_URL = process.env.CURATED_LOCAL_FEED_URL || "http://localhost:3000/api/jobs/curated-feed-data";

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET curated local feed — חייב להיות לפני /:id
router.get("/curated-feed-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/beit-hakerem-jobs.json");
    const raw      = await fs.promises.readFile(filePath, "utf-8");
    const jobs     = JSON.parse(raw);
    res.json(jobs);
  } catch (error) {
    res.status(500).send({ error: "שגיאה בקריאת קובץ המשרות" });
  }
});

// GET site statistics for About page
router.get("/stats/summary", async (req, res) => {
  try {
    const activeJobs = await Job.countDocuments({});
    const registeredUsers = await User.countDocuments({});
    const applications = await Application.countDocuments({});
    const organizations = await Job.distinct("organization");
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

// GET job by id — חייב להיות אחרי כל ה-routes הספציפיים כי /:id תופס הכל
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

// POST create new job
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);

    await job.save();

    res.status(201).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT update job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    // מחיקת כל המועמדויות של המשרה שנמחקה
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).send("Job deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

// ---------- מקורות משרות ----------
const JOB_SOURCES = [
  // רשויות מקומיות (HTML, לבדיקה ידנית)
  { sourceName: "עיריית כרמיאל",     organizationType: "רשות מקומית", city: "כרמיאל",      url: "https://www.karmiel.muni.il",  isDirectFetchSupported: false },
  { sourceName: "עיריית סח'נין",     organizationType: "רשות מקומית", city: "סח'נין",      url: "https://www.sakhnin.muni.il",  isDirectFetchSupported: false },
  { sourceName: "מג'ד אלכרום",       organizationType: "רשות מקומית", city: "מג'ד אלכרום", url: "",                             isDirectFetchSupported: false },
  { sourceName: "דיר אל אסד",        organizationType: "רשות מקומית", city: "דיר אל אסד",  url: "",                             isDirectFetchSupported: false },
  { sourceName: "בענה",              organizationType: "רשות מקומית", city: "בענה",        url: "",                             isDirectFetchSupported: false },
  { sourceName: "נחף",               organizationType: "רשות מקומית", city: "נחף",         url: "",                             isDirectFetchSupported: false },
  { sourceName: "ראמה",              organizationType: "רשות מקומית", city: "ראמה",        url: "",                             isDirectFetchSupported: false },
  { sourceName: "סאג'ור",            organizationType: "רשות מקומית", city: "סאג'ור",      url: "",                             isDirectFetchSupported: false },
  { sourceName: "שעב",               organizationType: "רשות מקומית", city: "שעב",         url: "",                             isDirectFetchSupported: false },
  { sourceName: "מועצה אזורית משגב", organizationType: "רשות מקומית", city: "משגב",        url: "https://www.misgav.org.il",    isDirectFetchSupported: false },
  // גופים ממשלתיים / ארגונים (HTML, לבדיקה ידנית)
  { sourceName: "נציבות שירות המדינה", organizationType: "ממשלתי",    region: "ארצי", url: "https://ejobs.gov.il",          isDirectFetchSupported: false },
  { sourceName: 'החברה למתנ"סים',      organizationType: 'מתנ"ס',     region: "ארצי", url: "https://www.matnasim.org.il",   isDirectFetchSupported: false },
  { sourceName: "AllJobs",             organizationType: "לוח דרושים", region: "ארצי", url: "https://www.alljobs.co.il",     isDirectFetchSupported: false },
  // Remotive — מקור API חיצוני אמיתי להדגמת הצינור; region: "global" → סינון אזור מושבת
  { sourceName: "Remotive", organizationType: "API חיצוני להדגמה", region: "global", url: "https://remotive.com/api/remote-jobs?limit=50", isDirectFetchSupported: true },
];

// ---------- סינון רלוונטיות ----------
// קטגוריות Remotive שאינן רלוונטיות — ייחסמו מיד
const BLOCKED_CATEGORIES = new Set([
  "software development", "data", "data and analytics", "sales", "marketing",
  "design", "devops / sysadmin", "product management", "finance / legal",
  "customer service", "writing", "artificial intelligence", "qa",
  "all others", "medical", "accounting", "hr",
]);

function isRelevantJob(titleAndCategory) {
  if (!titleAndCategory) return false;
  const t = String(titleAndCategory).toLowerCase();

  for (const cat of BLOCKED_CATEGORIES) {
    if (t.includes(cat)) return false;
  }

  const keywords = [
    // עברית — תפקידים
    "מדריך", "מדריכה", "רכז", "רכזת", "מנחה",
    "מנהל תוכנית", "מנהלת תוכנית", "מנהל תכנית", "מנהלת תכנית",
    "עובד נוער", "עובדת נוער", "קידום נוער",
    // עברית — תחומים / ארגונים
    "נוער", "חינוך", "חינוכי", "חינוך בלתי פורמלי", "הדרכה",
    "קהילה", "קהילתי", 'מתנ"ס', "מרכז קהילתי", "מרכז קהילה",
    "עמותה", "מנהיגות", "מעורבות חברתית", "רווחה", "ילדים", "צעירים",
    "מחלקת נוער", "תנועת נוער", "ארגון נוער",
    // אנגלית — ביטויים מורכבים
    "youth worker", "youth coordinator", "youth program", "youth leader",
    "youth development", "youth educator", "youth outreach",
    "community coordinator", "community outreach", "community educator",
    "community organizer", "community development",
    "social worker", "social work",
    "outreach coordinator", "outreach worker",
    "program coordinator", "program educator", "program facilitator",
    "education coordinator", "education specialist", "education program",
    "informal education", "non-profit", "welfare worker", "civic engagement",
    // אנגלית — מילות מפתח בודדות (רחבות יותר לצורך הדגמה עם Remotive)
    "education", "teaching", "teacher", "tutor", "instructor",
    "training", "learning", "community", "social", "nonprofit",
    "ngo", "youth", "children", "coordinator", "program",
    "content", "writing",
  ];
  return keywords.some(k => t.includes(k));
}

function shouldFilterArea(source) {
  return source.region !== "global";
}

function isRelevantArea(text) {
  if (!text) return true; // אם אין מידע אזור — לא לפסול
  const t = String(text).toLowerCase();
  const areas = [
    "כרמיאל", "סחנין", "סח'נין", "מג'ד אלכרום", "מגד אלכרום",
    "דיר אל אסד", "דיר אלאסד", "בענה", "נחף", "ראמה",
    "סאגור", "סאג'ור", "שעב", "משגב", "צפון", "גליל",
    "בית הכרם", "אשכול בית הכרם",
    // עבור מקור ה-API שמחזיר אזורים באנגלית
    "worldwide", "anywhere", "global", "remote", "israel",
  ];
  return areas.some(a => t.includes(a.toLowerCase()));
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function mapRemotiveJob(job) {
  return {
    title:            job.title,
    organization:     job.company_name,
    city:             job.candidate_required_location || "לא צוין",
    jobType:          job.category,
    description:      stripHtml(job.description).slice(0, 1000),
    source:           "external-local",
    sourceName:       "Remotive - API demo",
    organizationType: "API חיצוני להדגמה",
    applyUrl:         job.url,
    publishDate:      job.publication_date ? new Date(job.publication_date) : new Date(),
    isExternal:       true,
  };
}

// ---------- POST /import-local-sources ----------
router.post("/import-local-sources", async (req, res) => {
  const jobsToSave    = [];
  const skippedSources = [];
  let checkedSources  = 0;

  for (const source of JOB_SOURCES) {
    // מקור שלא תומך בשליפה ישירה → לבדיקה ידנית
    if (!source.isDirectFetchSupported || !source.url) {
      skippedSources.push({
        sourceName: source.sourceName,
        url:        source.url,
        reason:     "דורש בדיקה ידנית (אין API)",
      });
      continue;
    }

    // כל מקור עטוף ב-try/catch נפרד כדי שכשל אחד לא יפיל את השאר
    try {
      checkedSources++;
      const response = await fetch(source.url);

      if (!response.ok) {
        skippedSources.push({ sourceName: source.sourceName, url: source.url, reason: `סטטוס ${response.status}` });
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        skippedSources.push({ sourceName: source.sourceName, url: source.url, reason: "התשובה אינה JSON (כנראה דף HTML)" });
        continue;
      }

      const data    = await response.json();
      const rawJobs = data.jobs || data.data || [];

      for (const j of rawJobs) {
        if (jobsToSave.length >= 10) break;
        const mapped      = mapRemotiveJob(j);
        const haystack    = `${mapped.title} ${mapped.jobType}`;
        const passesArea  = shouldFilterArea(source) ? isRelevantArea(mapped.city) : true;
        if (isRelevantJob(haystack) && passesArea) {
          jobsToSave.push(mapped);
        }
      }
    } catch {
      skippedSources.push({ sourceName: source.sourceName, url: source.url, reason: "שגיאה בשליפה" });
    }
  }

  try {
    await Job.deleteMany({ source: "external-local" });
    const saved = await Job.insertMany(jobsToSave);
    res.status(200).send({
      imported:       saved.length,
      checkedSources,
      skippedSources,
      jobs:           saved,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// ---------- POST /import-curated-local-feed ----------
router.post("/import-curated-local-feed", async (req, res) => {
  try {
    const response = await fetch(CURATED_LOCAL_FEED_URL);

    if (!response.ok) {
      return res.status(502).send({ error: `שגיאה בשליפה ממאגר החיצוני: סטטוס ${response.status}` });
    }

    const rawJobs = await response.json();

    if (!Array.isArray(rawJobs)) {
      return res.status(502).send({ error: "המאגר החיצוני לא החזיר מערך משרות תקין" });
    }

    const mappedJobs = rawJobs
      .filter(job => job.title || job.organization || job.city || job.description || job.applyUrl)
      .map(job => ({
        title:            job.title            || "",
        organization:     job.organization     || "",
        city:             job.city             || "",
        jobType:          job.jobType          || "",
        employmentPercent: parseInt(job.positionPercent) || null,
        suitableForStudents: job.studentFriendly || false,
        description:      job.description      || "",
        applyUrl:         job.applyUrl         || "",
        source:           "curated-local-feed",
        sourceName:       job.sourceName       || "מאגר חיצוני - משרות בית הכרם",
        organizationType: job.organizationType || "מקור מקומי",
        isExternal:       true,
        publishDate:      job.publishDate ? new Date(job.publishDate) : new Date(),
      }));

    await Job.deleteMany({ source: "curated-local-feed" });
    const saved = await Job.insertMany(mappedJobs);

    res.status(200).send({ imported: saved.length, jobs: saved });
  } catch (error) {
    res.status(500).send({ error: "שגיאה בייבוא ממאגר חיצוני" });
  }
});

module.exports = router;