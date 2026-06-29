//This file handles the AI chat requests

const express = require("express");
const Job = require("../models/jobSchema");

const router = express.Router();

//Send the user's message to Gemini and return an answer
router.post("/chat", async (req, res) => {
  try {
    //Get the user's message and selected language
    const { message, language = "he" } = req.body;

    //Make sure a message was sent
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    //Make sure the Gemini API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing Gemini API key" });
    }

    //Get the latest jobs from the database
    const jobs = await Job.find({})
      .sort({ publishDate: -1, _id: -1 })
      .limit(25)
      .lean();

    //Convert the jobs into text so the AI can read them
    const jobsText = jobs.length
      ? jobs
          .map(
            (job, index) => `
${index + 1}.
שם המשרה: ${job.title || "לא צוין"}
ארגון: ${job.organization || "לא צוין"}
יישוב: ${job.city || "לא צוין"}
סוג משרה: ${job.jobType || "לא צוין"}
אחוז משרה: ${job.employmentPercent || "לא צוין"}
מתאים לסטודנטים: ${job.suitableForStudents ? "כן" : "לא"}
תיאור: ${job.description || "לא צוין"}
`
          )
          .join("\n")
      : "אין כרגע משרות במערכת.";

    //Choose the language for the AI response
    const answerLanguage = language === "ar" ? "Arabic" : "Hebrew";

    //Build the prompt that will be sent to Gemini
    const prompt = `
You are an AI job-search assistant for a regional jobs website.

Answer in ${answerLanguage}.

Important rules:
1. Recommend ONLY jobs that appear in the jobs list below.
2. Do NOT invent jobs, organizations, cities, or details.
3. If no job fits the user request exactly, say that clearly and suggest how to search.
4. Prefer matching by city, role, job type, education, youth, community, students, and employment percent.
5. Keep the answer friendly, short, and practical.
6. Mention the job title and city when recommending a job.

User question:
${message}

Real jobs currently in the system:
${jobsText}
`;

    //Send the prompt to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    //Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);

      return res.status(503).json({
        error: "שירות ה-AI עמוס כרגע. נסי שוב בעוד כמה רגעים.",
      });
    }

    const data = await response.json();

    //Get the AI answer from the response
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "לא התקבלה תשובה מה-AI.";

    res.json({ answer });
  } catch (error) {
    console.error("AI server error:", error);

    res.status(500).json({
      error: "שגיאה בשרת ה-AI.",
    });
  }
});

//Export the AI router
module.exports = router;