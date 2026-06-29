//This file adds sample jobs to the database

require("dotenv").config();

const mongoose = require("mongoose");

//Import the Job model
const Job = require("./models/jobSchema");

//Sample jobs that will be added to the database
const jobs = [
  {
    title: "רכז/ת נוער קהילתי",
    organization: 'מתנ"ס בית הכרם',
    city: "בית הכרם",
    jobType: "רכז",
    employmentPercent: 75,
    distanceMinutes: 20,
    suitableForStudents: false,
    description: "אחריות על תכנון, הפעלה והובלת תוכנית לנוער קהילתי. יצירת קשר משמעותי עם בני הנוער וליווי צוות מדריכים.",
    source: "manual",
    sourceName: "פרסום עצמאי",
    publishDate: new Date(),
  },
  {
    title: "מדריך/ה בתוכנית מנהיגות",
    organization: "עמותת דרך לחינוך",
    city: "מנחמיה",
    jobType: "מדריך",
    employmentPercent: 50,
    distanceMinutes: 40,
    suitableForStudents: true,
    description: "הדרכת קבוצות נוער בתוכנית פיתוח מנהיגות, פעמיים בשבוע.",
    source: "manual",
    sourceName: "פרסום עצמאי",
    publishDate: new Date(),
  },
  {
    title: "עובד/ת קהילה",
    organization: "מועצה אזורית בית הכרם",
    city: "בית הכרם",
    jobType: "עובד קהילה",
    employmentPercent: 100,
    distanceMinutes: 15,
    suitableForStudents: false,
    description: "עבודה קהילתית עם תושבים, בנייה והפעלה של תוכניות שכונתיות.",
    source: "external",
    sourceName: "לוח דרושים אזורי",
    publishDate: new Date(),
  },
  {
    title: "רכז/ת חינוך חברתי",
    organization: "עמותת דרך לחינוך",
    city: "שעב",
    jobType: "רכז",
    employmentPercent: 100,
    distanceMinutes: 50,
    suitableForStudents: false,
    description: "ריכוז תחום החינוך החברתי, עבודה מול מורים ותלמידים.",
    source: "manual",
    sourceName: "פרסום עצמאי",
    publishDate: new Date(),
  },
];

//Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {

    //Remove all old jobs before adding new ones
    await Job.deleteMany({});

    //Add all sample jobs to the database
    await Job.insertMany(jobs);

    console.log(`✅ הוכנסו ${jobs.length} משרות`);

    //Close the database connection
    await mongoose.disconnect();
  })
  .catch((err) => console.error("שגיאה:", err));