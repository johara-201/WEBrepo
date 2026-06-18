const mongoose = require("mongoose");
const Job = require("./models/jobSchema");

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

mongoose
  .connect("mongodb://johara2012000_db_user:qA6ztSvJyMKZNK6t@ac-77qve2r-shard-00-00.ybdhare.mongodb.net:27017,ac-77qve2r-shard-00-01.ybdhare.mongodb.net:27017,ac-77qve2r-shard-00-02.ybdhare.mongodb.net:27017/?ssl=true&replicaSet=atlas-iod2l4-shard-0&authSource=admin&appName=Cluster0")
  .then(async () => {
    await Job.deleteMany({});           // ניקוי קודם
    await Job.insertMany(jobs);          // הכנסת הנתונים
    console.log(`✅ הוכנסו ${jobs.length} משרות`);
    await mongoose.disconnect();
  })
  .catch((err) => console.error("שגיאה:", err));