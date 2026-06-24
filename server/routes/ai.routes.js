const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("AI route received:", message);
    console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
אתה עוזר AI באתר משרות לחינוך, נוער וקהילה.

ענה בעברית.

אם המשתמש שואל על חיפוש עבודה:
- הסבר כיצד להשתמש באתר.
- עזור להבין אילו משרות יכולות להתאים לו.
- הצע דרכי חיפוש לפי יישוב, תפקיד ואחוז משרה.

אם המשתמש שואל שאלה כללית שאינה קשורה למשרות:
ענה בקצרה ובנימוס.

אל תמציא משרות שאינן קיימות במערכת.

שאלת המשתמש:
${message}
`;

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);

      return res.status(503).json({
        error: "שירות ה-AI עמוס כרגע. נסי שוב בעוד כמה רגעים.",
      });
    }

    const data = await response.json();

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

module.exports = router;