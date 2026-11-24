/**
 * =========================================================================
 * The Letterform - AI Knowledge Base & Inquiries Sheet
 * =========================================================================
 * You can easily add, update, or edit inquiries, FAQs, and site information here!
 * The Gemini AI Chatbot dynamically reads this data to answer visitors accurately.
 *
 * (Optional) GOOGLE SHEET INTEGRATION:
 * If you publish a Google Sheet to web as CSV, paste the link in `googleSheetCsvUrl` below.
 * The chatbot will automatically fetch the latest rows from your Google Sheet!
 */

export const knowledgeBase = {
  // Live Google Sheet CSV URL (Auto-synced with The Letterform)
  googleSheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDbzqTB3QiTuji2k4OIQdYeOGL65HRkzcJv1tE1rF15Frq6fsr9_BASEIe-V2R58g5lrO820sX1dQr/pub?output=csv",

  // Core Website Information
  siteInfo: {
    name: "The Letterform",
    creator: "Mostakim",
    contactEmail: "mdmostakimhossen0176@gmail.com",
    tagline: "Ideas worth sitting with. An independent journal for curious minds.",
    description:
      "A quiet corner for thoughtful essays, deep observations, and 60-second educational shorts that reward a slower read.",
    navigation: {
      home: "/",
      stories: "/all-posts (catalog with instant search across all essays)",
      writeStory: "/add-post (rich-text story editor with TinyMCE and image upload)",
      eduReels: "/reels (vertical educational 60-second video lessons)",
      uploadReel: "/add-reel (upload educational video shorts)",
      profile: "/profile (author stats, stories management, word count)",
      help: "/help (image format guide, writing tips, publishing support)",
    },
    features: [
      "Interactive Like & Dislike on every essay and reel",
      "Reader responses & comments on stories",
      "EduReels vertical video player with auto-play on scroll & topic filtering",
      "Real-time story statistics (total stories, active count, drafts, word count)",
    ],
  },

  // Editable Inquiries, FAQs, and Knowledge Entries
  // You can add as many new questions and answers as you want!
  inquiries: [
    {
      question: "What is The Letterform?",
      answer:
        "The Letterform is an independent editorial journal and educational platform designed for curious minds. It features slow-form essays and bite-sized EduReels covering programming, science, design, and ideas.",
    },
    {
      question: "How can I publish an essay or story?",
      answer:
        "First, create a free account or sign in. Then click 'Write' in the navigation bar to access the rich-text editor, upload a cover image (1600x900 landscape recommended), write your piece, and hit Submit.",
    },
    {
      question: "What are EduReels and how can I upload one?",
      answer:
        "EduReels are short 15–90 second vertical educational videos on topics like Programming, Science, Mathematics, and Design. You can watch them in the 'EduReels' section or click '+ Upload Reel' to share your own lesson.",
    },
    {
      question: "Can readers like, dislike, and comment on stories?",
      answer:
        "Yes! Every published story features a real-time Like/Dislike reaction bar as well as a Responses & Feedback discussion section where readers can share their thoughts.",
    },
    {
      question: "How do I edit my profile name or view my story statistics?",
      answer:
        "Sign in and visit the 'Profile' page. You can see your total stories penned, active published count, draft counts, and total words written, plus update your display name anytime.",
    },
    {
      question: "Who built The Letterform?",
      answer:
        "The Letterform was created and developed by Torab Mostakim (Md. Mostakim) using React, Vite, Tailwind CSS, Appwrite, and Google Gemini AI.",
    },
    {
      question: "How can I contact Torab Mostakim or The Letterform team?",
      answer:
        "You can reach out directly via email at mdmostakimhossen0176@gmail.com for questions, editorial inquiries, or collaborations.",
    },
  ],

  // Extra Announcements or Notices you want the AI to tell visitors
  announcements: [
    "Welcome to the new EduReels section! Explore quick educational shorts right from the top navigation.",
    "Writers can now track their total word count and story drafts directly from their Profile dashboard.",
  ],
};
