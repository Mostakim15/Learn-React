import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config";

export default function LikeDislike({ slug, initialLikes = [], initialDislikes = [], userData }) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(Array.isArray(initialLikes) ? initialLikes : []);
  const [dislikes, setDislikes] = useState(Array.isArray(initialDislikes) ? initialDislikes : []);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const currentUserId = userData?.$id;
  const isLiked = currentUserId ? likes.includes(currentUserId) : false;
  const isDisliked = currentUserId ? dislikes.includes(currentUserId) : false;

  const showLoginPrompt = () => {
    setNotice("Please sign in to like or dislike this story.");
    setTimeout(() => setNotice(""), 3500);
  };

  const handleLike = async () => {
    if (!currentUserId) {
      showLoginPrompt();
      return;
    }
    if (loading) return;

    // Optimistic calculation
    let nextLikes;
    let nextDislikes = dislikes;

    if (isLiked) {
      // Toggle off
      nextLikes = likes.filter((id) => id !== currentUserId);
    } else {
      // Add like and remove dislike if present
      nextLikes = [...likes, currentUserId];
      nextDislikes = dislikes.filter((id) => id !== currentUserId);
    }

    const prevLikes = likes;
    const prevDislikes = dislikes;

    setLikes(nextLikes);
    setDislikes(nextDislikes);
    setLoading(true);

    try {
      const res = await appwriteService.updateLikes(slug, {
        likes: nextLikes,
        dislikes: nextDislikes,
      });
      if (!res) {
        // Rollback on failure
        setLikes(prevLikes);
        setDislikes(prevDislikes);
      }
    } catch {
      setLikes(prevLikes);
      setDislikes(prevDislikes);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!currentUserId) {
      showLoginPrompt();
      return;
    }
    if (loading) return;

    // Optimistic calculation
    let nextDislikes;
    let nextLikes = likes;

    if (isDisliked) {
      // Toggle off
      nextDislikes = dislikes.filter((id) => id !== currentUserId);
    } else {
      // Add dislike and remove like if present
      nextDislikes = [...dislikes, currentUserId];
      nextLikes = likes.filter((id) => id !== currentUserId);
    }

    const prevLikes = likes;
    const prevDislikes = dislikes;

    setLikes(nextLikes);
    setDislikes(nextDislikes);
    setLoading(true);

    try {
      const res = await appwriteService.updateLikes(slug, {
        likes: nextLikes,
        dislikes: nextDislikes,
      });
      if (!res) {
        // Rollback on failure
        setLikes(prevLikes);
        setDislikes(prevDislikes);
      }
    } catch {
      setLikes(prevLikes);
      setDislikes(prevDislikes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start gap-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e2d7] bg-white p-1.5 shadow-sm">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          aria-label="Like story"
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            isLiked
              ? "bg-[#172b3a] text-white shadow-sm"
              : "text-[#686b70] hover:bg-[#f8f6f1] hover:text-[#172b3a]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{likes.length}</span>
        </button>

        <span className="h-4 w-px bg-[#e9e2d7]" aria-hidden="true" />

        {/* Dislike Button */}
        <button
          type="button"
          onClick={handleDislike}
          disabled={loading}
          aria-label="Dislike story"
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            isDisliked
              ? "bg-[#8e3b35] text-white shadow-sm"
              : "text-[#686b70] hover:bg-[#f8f6f1] hover:text-[#172b3a]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isDisliked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76 1.04m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
            />
          </svg>
          <span>{dislikes.length}</span>
        </button>
      </div>

      {/* Notice / Prompt */}
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-[#b77945]/30 bg-amber-50 px-3 py-1.5 text-xs text-[#8c5222]">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold underline underline-offset-2 hover:text-[#b77945]"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}

