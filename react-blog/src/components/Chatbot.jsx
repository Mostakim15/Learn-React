import React, { useEffect } from "react";

const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL ||
  "https://torabmostakim.app.n8n.cloud/webhook/40c4b39f-08cf-4a7d-826f-aba5b1ab09c3/chat";

export default function Chatbot() {
  useEffect(() => {
    // Prevent duplicate initializations
    if (window.__n8nChatInitialized) return;

    // 1. Inject n8n chat stylesheet if not present
    const styleId = "n8n-chat-style";
    if (!document.getElementById(styleId)) {
      const link = document.createElement("link");
      link.id = styleId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
      document.head.appendChild(link);
    }

    // 2. Inject custom styling to match The Letterform branding
    const customStyleId = "n8n-chat-custom-style";
    if (!document.getElementById(customStyleId)) {
      const customStyle = document.createElement("style");
      customStyle.id = customStyleId;
      customStyle.textContent = `
        :root {
          --chat--color-primary: #172b3a;
          --chat--color-primary-shade-50: #243d4f;
          --chat--color-primary-shade-100: #101e29;
          --chat--color-secondary: #b77945;
          --chat--color-light: #f8f6f1;
          --chat--color-light-shade-50: #e9e2d7;
          --chat--color-dark: #172b3a;
          --chat--color-disabled: #9a9b9d;
          --chat--color-typing: #b77945;
          --chat--border-radius: 18px;
          --chat--header--background: #172b3a;
          --chat--header--color: #ffffff;
          --chat--toggle--background: #172b3a;
          --chat--toggle--hover--background: #b77945;
          --chat--toggle--color: #ffffff;
          --chat--message--bot--background: #ffffff;
          --chat--message--bot--color: #172b3a;
          --chat--message--user--background: #172b3a;
          --chat--message--user--color: #ffffff;
        }
        .chat-toggle {
          box-shadow: 0 10px 30px rgba(23, 43, 58, 0.25) !important;
          transition: all 0.25s ease !important;
        }
        .chat-toggle:hover {
          transform: scale(1.06) !important;
        }
        .chat-window {
          box-shadow: 0 20px 60px rgba(23, 43, 58, 0.15) !important;
          border: 1px solid #e9e2d7 !important;
        }
      `;
      document.head.appendChild(customStyle);
    }

    // 3. Import n8n chat bundle and initialize
    let isMounted = true;
    import(
      /* @vite-ignore */ "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
    )
      .then(({ createChat }) => {
        if (!isMounted || window.__n8nChatInitialized) return;
        window.__n8nChatInitialized = true;

        createChat({
          webhookUrl: N8N_WEBHOOK_URL,
          mode: "window",
          showWelcomeScreen: true,
          defaultLanguage: "en",
          initialMessages: [
            "Hello! Welcome to The Letterform. 👋",
            "How can I help you explore or write stories today?",
          ],
          i18n: {
            en: {
              title: "The Letterform Assistant",
              subtitle: "Ask about essays, writers, or publishing.",
              footer: "",
              getStarted: "Start Chat",
              inputPlaceholder: "Type your question…",
            },
          },
        });
      })
      .catch((err) => {
        console.error("Failed to load n8n chat widget:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
