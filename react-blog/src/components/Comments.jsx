import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from "./Button";

function formatDate(dateStr) {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function Comments({ postId, userData }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    if (!postId) return;

    appwriteService
      .getComments(postId)
      .then((res) => {
        if (!active) return;
        if (res && res.documents) {
          setComments(res.documents);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error("Comments :: getComments :: error", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    if (!userData?.$id) {
      setError("Please sign in to post a comment or leave feedback.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const commentDoc = await appwriteService.createComment({
        postId,
        userId: userData.$id,
        userName: userData.name || "Reader",
        content: trimmed,
      });

      if (commentDoc) {
        setComments((prev) => [commentDoc, ...prev]);
        setContent("");
      }
    } catch (err) {
      console.error("Comments :: handleSubmit :: error", err);
      setError(err?.message || "Failed to post feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm("Are you sure you want to delete this comment?");
    if (!confirm) return;

    setDeletingId(commentId);
    try {
      const ok = await appwriteService.deleteComment(commentId);
      if (ok) {
        setComments((prev) => prev.filter((c) => c.$id !== commentId));
      }
    } catch (err) {
      console.error("Comments :: handleDelete :: error", err);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-16 border-t border-[#e9e2d7] pt-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">Discussion</p>
          <h2 className="editorial-serif mt-2 text-3xl font-bold text-[#172b3a]">
            Responses & Feedback <span className="text-xl font-normal text-[#9a9b9d]">({comments.length})</span>
          </h2>
        </div>
      </div>

      {/* Form or Login prompt */}
      <div className="mt-8">
        {userData ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e9e2d7] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#172b3a] text-xs font-bold text-white">
                {userData.name ? userData.name[0].toUpperCase() : "U"}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#172b3a]">{userData.name || "Reader"}</p>
                <p className="text-xs text-[#9a9b9d]">Share thoughtful feedback or a response</p>
              </div>
            </div>

            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}

            <div className="mt-4">
              <label htmlFor="comment-text" className="sr-only">Your comment</label>
              <textarea
                id="comment-text"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a response or share your feedback..."
                className="w-full rounded-xl border border-[#e9e2d7] bg-[#f8f6f1] p-4 text-sm text-[#172b3a] outline-none transition placeholder:text-[#9a9b9d] focus:border-[#b77945] focus:bg-white"
                maxLength={1000}
                required
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#9a9b9d]">{content.length}/1000 characters</span>
              <Button type="submit" disabled={submitting || !content.trim()} className="text-xs">
                {submitting ? "Publishing…" : "Post Response"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-[#e9e2d7] bg-white p-6 text-center shadow-sm sm:p-8">
            <h3 className="editorial-serif text-xl font-bold text-[#172b3a]">Join the conversation</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#686b70]">
              Sign in to leave feedback, respond to the author, and take part in the discussion.
            </p>
            <div className="mt-5">
              <Link to="/login">
                <Button className="text-xs">Sign in to respond →</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="mt-10 space-y-5">
        {loading && (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-[#e9e2d7]" />
            <div className="h-24 animate-pulse rounded-2xl bg-[#e9e2d7]" />
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#e9e2d7] p-10 text-center">
            <p className="editorial-serif text-lg font-bold text-[#172b3a]">No responses yet.</p>
            <p className="mt-1 text-sm text-[#686b70]">Be the first to share your perspective on this story.</p>
          </div>
        )}

        {!loading && comments.length > 0 && comments.map((comment) => {
          const isOwner = userData?.$id && comment.userId === userData.$id;
          const isDeleting = deletingId === comment.$id;
          const initial = comment.userName ? comment.userName[0].toUpperCase() : "R";

          return (
            <article
              key={comment.$id}
              className="rounded-2xl border border-[#e9e2d7] bg-white p-5 shadow-sm transition hover:border-[#b77945]/40 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f6f1] text-xs font-bold text-[#172b3a] border border-[#e9e2d7]">
                    {initial}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#172b3a]">{comment.userName || "Reader"}</h4>
                    <p className="text-xs text-[#9a9b9d]">{formatDate(comment.$createdAt)}</p>
                  </div>
                </div>

                {isOwner && (
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDelete(comment.$id)}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                )}
              </div>

              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#334a59]">
                {comment.content}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
