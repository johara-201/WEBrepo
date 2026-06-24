import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import NavBar from "../../Components/NavBar";
import { callGeminiAPI, getDemoResponse } from "./aiChatService";

/**
 * AI chat component for helping users search and understand job opportunities.
 */
function AIChat({ onHome, onSearch, onAbout, onFaq, onAdmin, onDashboard, onAIChat }) {

  // Chat messages history
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "שלום! אני עוזר AI לחיפוש משרות בחינוך, נוער וקהילה. איך אפשר לעזור?",
    },
  ]);

  // User input and chat state
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Sends a user message and receives an AI response.
   */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input.trim();

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentInput }
    ]);

    setInput("");
    setLoading(true);

    try {

      const aiResponse = await callGeminiAPI(currentInput);

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse }
      ]);

    } catch (error) {

      // Display error message in chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getDemoResponse(currentInput),
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  /**
   * Allows sending messages with Enter key.
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
  <div dir="rtl" className="min-h-screen bg-gray-50 text-right">
    <NavBar
      activePage="aiChat"
      onHome={onHome}
      onSearch={onSearch}
      onAbout={onAbout}
      onFaq={onFaq}
      onAdmin={onAdmin}
      onDashboard={onDashboard}
      onAIChat={onAIChat}
    />

    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <div className="bg-[#2f6b46] text-white p-5">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot />
            צ׳אט AI לחיפוש משרות
          </h1>

          <p className="text-sm mt-1">
            עוזר למשתמשים להבין איך למצוא משרה מתאימה באתר
          </p>

        </div>

        <div className="h-[430px] overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user"
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div className="mt-1">
                {msg.role === "user"
                  ? <User size={22} />
                  : <Bot size={22} />}
              </div>

              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm leading-6 ${
                  msg.role === "user"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-[#e8f3ec] text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2
                className="animate-spin"
                size={18}
              />
              חושב...
            </div>
          )}
        </div>

        <div className="border-t p-4 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="כתבי שאלה על חיפוש משרה..."
            className="flex-1 border rounded-xl p-3 resize-none focus:outline-none"
            rows={2}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#2f6b46] text-white px-5 rounded-xl hover:bg-[#245539] disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>

      </div>
    </main>
  </div>
);
}

export default AIChat;