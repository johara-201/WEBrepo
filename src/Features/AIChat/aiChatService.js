/**
 * Returns a predefined response if the server AI request fails.
 */
export function getDemoResponse(userInput, language = "he") {
  const text = userInput.toLowerCase();

  if (language === "ar") {
    if (
      text.includes("وظيفة") ||
      text.includes("وظائف") ||
      text.includes("عمل") ||
      text.includes("شغل")
    ) {
      return "يمكنني مساعدتك في العثور على وظائف حسب المجال، البلدة، نسبة الوظيفة ونوع الوظيفة.";
    }

    if (
      text.includes("طالب") ||
      text.includes("طالبة") ||
      text.includes("طلاب") ||
      text.includes("طالبات")
    ) {
      return "يمكن البحث عن وظائف مناسبة للطلاب من خلال التصفية في الموقع.";
    }

    if (
      text.includes("مرحبا") ||
      text.includes("مرحبًا") ||
      text.includes("اهلا") ||
      text.includes("أهلا") ||
      text.includes("السلام")
    ) {
      return "مرحبًا! كيف يمكنني مساعدتك في البحث عن وظيفة؟";
    }

    return `استلمت سؤالك: "${userInput}". خدمة الـ AI غير متاحة حاليًا، حاولي مرة أخرى بعد قليل.`;
  }

  if (text.includes("משרה") || text.includes("עבודה")) {
    return "אני יכולה לעזור לך למצוא משרות לפי תחום, יישוב, אחוז משרה וסוג תפקיד.";
  }

  if (text.includes("סטודנט") || text.includes("סטודנטית") || text.includes("סטודנטים")) {
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
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function callGeminiAPI(userInput, language = "he") {
  const response = await fetch(`${API}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userInput,
      language,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "AI request failed");
  }

  const data = await response.json();
  return data.answer;
}