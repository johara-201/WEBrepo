/**
 * Returns a predefined response if the server AI request fails.
 */
export function getDemoResponse(userInput) {
  const text = userInput.toLowerCase();

  if (text.includes("משרה") || text.includes("עבודה")) {
    return "אני יכולה לעזור לך למצוא משרות לפי תחום, יישוב, אחוז משרה וסוג תפקיד.";
  }

  if (text.includes("סטודנט")) {
    return "אפשר לחפש משרות שמתאימות לסטודנטים דרך הסינון באתר.";
  }

  if (text.includes("שלום") || text.includes("היי")) {
    return "שלום! איך אפשר לעזור לך בחיפוש משרה?";
  }

  return `קיבלתי את השאלה שלך: "${userInput}". כרגע שירות ה-AI לא זמין, נסי שוב בעוד רגע.`;
}

/**
 * Sends the user message to our backend server.
 * The backend calls Gemini securely using the API key from .env.
 */
export async function callGeminiAPI(userInput) {
  const response = await fetch("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userInput,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "AI request failed");
  }

  const data = await response.json();
  return data.answer;
}