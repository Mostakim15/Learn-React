import React, { useEffect, useRef, useState } from "react";
import appwriteService from "../appwrite/config";

export default function ReelCard({ reel, userData, isActive, onDelete }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(Array.isArray(reel.likes) ? reel.likes : []);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = userData?.$id;
  const isLiked = currentUserId ? likes.includes(currentUserId) : false;
  const isAuthor = currentUserId && currentUserId === reel.userId;

  const videoUrl = reel.videoFileId ? appwriteService.getFileView(reel.videoFileId) : "";

  // Play/Pause on active slide change and track media state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 800);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
      });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUserId) {
      alert("Please sign in to like this educational reel.");
      return;
    }

    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 500);

    const prevLikes = likes;
    const nextLikes = isLiked
      ? likes.filter((id) => id !== currentUserId)
      : [...likes, currentUserId];

    setLikes(nextLikes);

    try {
      const res = await appwriteService.updateReelLikes(reel.$id, nextLikes);
      if (!res) setLikes(prevLikes);
    } catch {
      setLikes(prevLikes);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: reel.description || "Watch this educational reel on The Letterform",
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirm = window.confirm(`Delete reel "${reel.title}"?`);
    if (!confirm) return;

    setIsDeleting(true);
    try {
      const ok = await appwriteService.deleteReel(reel.$id);
      if (ok) {
        if (reel.videoFileId) {
          await appwriteService.deleteFile(reel.videoFileId);
        }
        if (onDelete) onDelete(reel.$id);
      }
    } catch (err) {
      console.error("Failed to delete reel", err);
      alert("Failed to delete reel.");
    } finally {
      setIsDeleting(false);
    }
  };

  const authorInitial = reel.authorName ? reel.authorName[0].toUpperCase() : "E";

  return (
    <div className="relative mx-auto flex h-[78vh] max-h-[820px] w-full max-w-[420px] snap-center flex-col justify-end overflow-hidden rounded-3xl border border-[#e9e2d7] bg-black shadow-[0_20px_60px_rgba(23,43,58,0.25)] select-none sm:h-[82vh]">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />

      {/* Play/Pause Transient Icon Overlay */}
      {showPlayIcon && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
            {isPlaying ? (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-8 w-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Top Header Controls: Topic & Mute Button */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
        <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f8f6f1] backdrop-blur-md">
          #{reel.topic || "Education"}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
        >
          {isMuted ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Right Side Action Rail */}
      <div className="absolute bottom-16 right-3.5 z-20 flex flex-col items-center gap-4">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          aria-label="Like reel"
          className="group flex flex-col items-center gap-1"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition ${
              isLiked ? "bg-[#b77945] text-white" : "bg-black/40 text-white hover:bg-black/60"
            } ${likeAnimating ? "scale-125" : "scale-100"}`}
          >
            <svg
              className="h-5 w-5 transition duration-200"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {likes.length}
          </span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share reel"
          className="group flex flex-col items-center gap-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {copied ? "Copied!" : "Share"}
          </span>
        </button>

        {/* Delete button (Author only) */}
        {isAuthor && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            aria-label="Delete reel"
            className="group flex flex-col items-center gap-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-950/60 text-red-200 backdrop-blur-md transition hover:bg-red-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Bottom Content Overlay */}
      <div className="relative z-10 p-5 pr-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {/* Author details */}
        <div className="mb-2 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b77945] text-xs font-bold text-white">
            {authorInitial}
          </span>
          <span className="text-xs font-bold text-white drop-shadow">
            {reel.authorName || "Educator"}
          </span>
        </div>

        {/* Title */}
        <h3 className="editorial-serif text-lg font-bold leading-tight text-white drop-shadow">
          {reel.title}
        </h3>

        {/* Description / Summary */}
        {reel.description && (
          <div className="mt-1.5 text-xs text-white/90 drop-shadow">
            <p className={expanded ? "" : "line-clamp-2"}>{reel.description}</p>
            {reel.description.length > 70 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="mt-0.5 text-[11px] font-bold text-[#f5c69b] hover:underline"
              >
                {expanded ? "Show less" : "more"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Video Progress Bar */}
      <div className="relative z-20 h-1 w-full bg-white/20">
        <div
          className="h-full bg-[#b77945] transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
