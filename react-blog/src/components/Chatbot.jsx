import React, { useEffect, useRef, useState } from "react";
import confi from "../confi/confi";
import { knowledgeBase } from "../data/knowledgeBase";
import { LetterformIcon } from "./Logo";

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODELS = ["gemini-3.7-flash", "gemini-3.1-flash-lite"];

const SUGGESTIONS = [
  "What is The Letterform?",
  "How can I publish an essay?",
  "Tell me about EduReels",
  "Who created this blog?",
];

function formatMessageContent(text = "") {
  if (!text) return "";
  const segments = text.split(/(\*\*.*?\*\*)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-inherit">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return seg;
  });
}

function buildSystemPrompt(kb) {
  const inquiriesText = kb.inquiries
    .map((item, idx) => `Q${idx + 1}: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const announcementsText = kb.announcements?.length
    ? `Current Announcements:\n${kb.announcements.join("\n")}`
    : "";

  return `
You are the dedicated, intelligent, and warm AI Assistant for "The Letterform", an independent editorial journal and educational website created by Torab Mostakim (Md. Mostakim).

Website Background:
- Tagline: "${kb.siteInfo.tagline}"
- Description: "${kb.siteInfo.description}"
- Key Navigation & Pages:
  - Home: "/" (Featured essays, latest stories, editorial notes)
  - EduReels: "/reels" (Vertical 60-second educational video lessons with topics like Programming, Science, Math, Design)
  - Upload Reel: "/add-reel" (Creators can publish short vertical video lessons)
  - Stories Catalog: "/all-posts" (Searchable directory of all published essays)
  - Write Story: "/add-post" (Rich-text editor with TinyMCE and image upload)
  - Author Profile: "/profile" (Personal dashboard with total stories, drafts, published count, word count, and name editor)
  - Help Center: "/help" (Practical publishing guide and cover image instructions)
- Key Features:
  - Like & Dislike reaction bar on all stories and reels
  - Responses & Reader Discussion / Feedback section on all stories
  - Fast search by title and content
  - Creator: Torab Mostakim (Md. Mostakim)
  - Official Contact Email: mdmostakimhossen0176@gmail.com (Provide this email whenever someone asks for contact info, help, inquiries, or collaboration)

Official Knowledge Base & Inquiries Sheet:
${inquiriesText}

${announcementsText}

Guidelines:
1. Always be polite, helpful, articulate, and welcoming.
2. If the user greets or asks in Bengali (বা বাংলা ভাষায়), reply fluently in Bengali. If they ask in English, reply in English.
3. Guide users seamlessly on how to use the website, read stories, watch reels, publish articles, or reach out.
4. Keep answers concise, clear, and well-structured.
`.trim();
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! Welcome to **The Letterform**. I'm your AI guide powered by Google Gemini. How can I help you explore essays, educational reels, or publishing today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [kb, setKb] = useState(knowledgeBase);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-fetch live Google Sheet data if CSV URL is provided
  useEffect(() => {
    if (!knowledgeBase.googleSheetCsvUrl) return;

    fetch(knowledgeBase.googleSheetCsvUrl)
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.trim().split(/\r?\n/);
        if (rows.length <= 1) return;

        // Parse header row to dynamically locate columns
        const headerCells = rows[0]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());

        let qIdx = headerCells.findIndex((h) => h.includes("question") || h.includes("inquiry"));
        let aIdx = headerCells.findIndex((h) => h.includes("answer") || h.includes("reply") || h.includes("info"));
        const statusIdx = headerCells.findIndex((h) => h.includes("status"));

        // Fallbacks if user did not use exact header words
        if (qIdx === -1) qIdx = 0;
        if (aIdx === -1) aIdx = headerCells.length > 1 ? 1 : 0;

        const sheetInquiries = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row.trim()) continue;

          const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const q = parts[qIdx]?.replace(/^"|"$/g, "").trim();
          const a = parts[aIdx]?.replace(/^"|"$/g, "").trim();
          const status = statusIdx !== -1 ? parts[statusIdx]?.replace(/^"|"$/g, "").trim().toLowerCase() : "active";

          // Only include active rows that have both a question and answer
          if (q && a && status !== "draft" && status !== "inactive") {
            sheetInquiries.push({ question: q, answer: a });
          }
        }

        if (sheetInquiries.length > 0) {
          setKb((prev) => ({
            ...prev,
            inquiries: [...prev.inquiries, ...sheetInquiries],
          }));
        }
      })
      .catch((err) => {
        console.warn("Chatbot :: Failed to fetch Google Sheet CSV", err);
      });
  }, []);

  useEffect(() => {
    if (!knowledgeBase.googleSheetCsvUrl) return;

    fetch(knowledgeBase.googleSheetCsvUrl)
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.trim().split(/\r?\n/);
        if (rows.length <= 1) return;

        const sheetInquiries = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row.trim()) continue;

          const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const q = parts[qIdx]?.replace(/^"|"$/g, "").trim();
          const a = parts[aIdx]?.replace(/^"|"$/g, "").trim();
          const status = statusIdx !== -1 ? parts[statusIdx]?.replace(/^"|"$/g, "").trim().toLowerCase() : "active";

          // Only include active rows that have both a question and answer
          if (q && a && status !== "draft" && status !== "inactive") {
            sheetInquiries.push({ question: q, answer: a });
          }
        }

        if (sheetInquiries.length > 0) {
          setKb((prev) => ({
            ...prev,
            inquiries: [...prev.inquiries, ...sheetInquiries],
          }));
        }
      })
      .catch((err) => {
        console.warn("Chatbot :: Failed to fetch Google Sheet CSV", err);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const callGemini = async (contents) => {
    const apiKey = confi.geminiApiKey;
    if (!apiKey) {
      throw new Error("Gemini API key is missing in your configuration.");
    }

    const systemInstruction = buildSystemPrompt(kb);

    const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 800,
            },
          }),
        });

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }

        // If 503 (model high demand), loop to next fallback model
        if (data.error?.code === 503) {
          console.warn(`Model ${model} busy, trying fallback...`);
          continue;
        }

        if (data.error?.message) {
          throw new Error(data.error.message);
        }
      } catch (err) {
        if (model === modelsToTry[modelsToTry.length - 1]) {
          throw err;
        }
      }
    }

    throw new Error("Unable to connect to Google Gemini. Please try again shortly.");
  };

  const sendMessage = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMessage = {
      role: "user",
      text: prompt,
      time: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Format for Gemini API contents
    const contents = nextMessages
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

    try {
      const reply = await callGemini(contents);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: reply, time: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I apologize, but I encountered an issue: ${err.message || "Could not generate reply."}`,
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        text: "Conversation refreshed. How can I help you explore The Letterform today?",
        time: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Assistant" : "Open Letterform Assistant"}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#172b3a] text-white shadow-[0_10px_35px_rgba(23,43,58,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#b77945] focus:outline-none"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative flex items-center justify-center">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5c69b] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#b77945]" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 z-50 flex h-[calc(100dvh-100px)] max-h-[500px] w-[calc(100vw-24px)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-[#e9e2d7] bg-[#f8f6f1] shadow-[0_20px_60px_rgba(23,43,58,0.25)] sm:bottom-24 sm:right-6 sm:max-h-[540px]">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#e9e2d7] bg-[#172b3a] px-4 py-3 text-white sm:px-5 sm:py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-[#172b3a] shadow-inner sm:h-9 sm:w-9">
                <LetterformIcon className="h-full w-full" />
              </div>
              <div>
                <h3 className="editorial-serif text-sm font-bold leading-none tracking-wide text-white sm:text-base">
                  The Letterform AI
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#e9e2d7]/80 sm:text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Powered by Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Restart conversation"
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3 scrollbar-thin sm:p-4 sm:space-y-3.5">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm leading-relaxed ${isUser
                      ? "bg-[#172b3a] text-white shadow-sm rounded-br-xs"
                      : "border border-[#e9e2d7] bg-white text-[#172b3a] shadow-sm rounded-bl-xs"
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{formatMessageContent(msg.text)}</p>
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-[#9a9b9d]">
                    {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#686b70]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#e9e2d7]">
                  <span className="h-2 w-2 rounded-full bg-[#b77945] animate-ping" />
                </div>
                <span>Thinking…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="shrink-0 border-t border-[#e9e2d7]/70 bg-white/60 px-3 py-2">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9a9b9d]">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-[#e9e2d7] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#172b3a] transition hover:border-[#b77945] hover:text-[#b77945]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="shrink-0 border-t border-[#e9e2d7] bg-white p-2.5 sm:p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#e9e2d7] bg-[#f8f6f1] px-3 py-1.5 transition focus-within:border-[#b77945] focus-within:bg-white">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about essays, reels, publishing..."
                className="w-full bg-transparent text-xs text-[#172b3a] outline-none placeholder:text-[#9a9b9d] sm:text-sm"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#172b3a] text-white transition hover:bg-[#b77945] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
