import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button, Container } from "../components";

function getExcerpt(content = "") {
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plainText.length > 100 ? `${plainText.slice(0, 100)}…` : plainText;
}

function calculateReadingTime(content = "") {
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function formatDate(dateStr) {
  if (!dateStr) return "Recently";
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

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  // Name editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userData?.name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    let active = true;
    if (!userData?.$id) return;

    appwriteService
      .getPosts([])
      .then((res) => {
        if (!active) return;
        if (res && res.documents) {
          const userStories = res.documents.filter(
            (p) => p.userId === userData.$id
          );
          setPosts(userStories);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Profile :: getPosts :: error", err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userData?.$id]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameMessage({ text: "Name cannot be empty", type: "error" });
      return;
    }
    setNameSaving(true);
    setNameMessage({ text: "", type: "" });
    try {
      await authService.updateName(trimmed);
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        dispatch(login(updatedUser));
      }
      setIsEditingName(false);
      setNameMessage({ text: "Profile name updated successfully.", type: "success" });
      setTimeout(() => setNameMessage({ text: "", type: "" }), 4000);
    } catch (err) {
      setNameMessage({
        text: err?.message || "Failed to update profile name.",
        type: "error",
      });
    } finally {
      setNameSaving(false);
    }
  };

  const handleDeletePost = async (post) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setIsDeleting(post.$id);
    try {
      const success = await appwriteService.deletePost(post.$id);
      if (success) {
        if (post.blogImage) {
          await appwriteService.deleteFile(post.blogImage);
        }
        setPosts((prev) => prev.filter((p) => p.$id !== post.$id));
      }
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete story. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Metrics
  const activeCount = useMemo(
    () => posts.filter((p) => p.status === "active").length,
    [posts]
  );
  const draftCount = useMemo(
    () => posts.filter((p) => p.status === "inactive").length,
    [posts]
  );
  const totalWords = useMemo(
    () =>
      posts.reduce(
        (sum, p) => sum + calculateReadingTime(p.content || "").words,
        0
      ),
    [posts]
  );

  // Filtered stories
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus =
        filterStatus === "all" ? true : post.status === filterStatus;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = normalizedQuery
        ? post.title?.toLowerCase().includes(normalizedQuery) ||
          post.content?.toLowerCase().includes(normalizedQuery)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [posts, filterStatus, searchQuery]);

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <main className="py-12 sm:py-16">
      <Container>
        {/* Breadcrumb / Section Header */}
        <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="text-[#e9e2d7]">/</span>
          <span>Author Profile</span>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-[#e9e2d7] bg-white shadow-[0_15px_50px_rgba(23,43,58,0.05)]">
          {/* Top Banner Accent */}
          <div className="h-28 bg-gradient-to-r from-[#172b3a] via-[#243d4f] to-[#b77945]/80 sm:h-36" />

          <div className="px-6 pb-8 pt-0 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + Main Identity */}
              <div className="relative -mt-14 flex items-end gap-5 sm:-mt-16 sm:gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#172b3a] shadow-md ring-2 ring-[#e9e2d7] sm:h-28 sm:w-28">
                  <span className="editorial-serif text-3xl font-bold tracking-wider text-[#f8f6f1] sm:text-4xl">
                    {initials}
                  </span>
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f8f6f1] px-3 py-0.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b77945] border border-[#e9e2d7]">
                      Staff Writer
                    </span>
                    <span className="text-xs text-[#9a9b9d]">
                      Member since {formatDate(userData?.$createdAt)}
                    </span>
                  </div>
                  <h1 className="editorial-serif mt-1 text-3xl font-bold tracking-tight text-[#172b3a] sm:text-4xl">
                    {userData?.name || "Member"}
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    setNewName(userData?.name || "");
                    setIsEditingName((prev) => !prev);
                  }}
                  bgColor="bg-[#f8f6f1]"
                  textColor="text-[#172b3a]"
                  className="border border-[#e9e2d7] hover:border-[#b77945] hover:text-[#b77945]"
                >
                  {isEditingName ? "Cancel" : "Edit Profile"}
                </Button>
                <Link to="/add-post">
                  <Button className="flex items-center gap-2 shadow-sm">
                    <span>+</span> Write Story
                  </Button>
                </Link>
              </div>
            </div>

            {/* Email & Tagline */}
            <div className="mt-6 border-t border-[#e9e2d7]/70 pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#686b70]">
                  <strong className="font-semibold text-[#172b3a]">Email:</strong> {userData?.email || "—"}
                </p>
                <p className="text-sm italic text-[#9a9b9d] editorial-serif">
                  “Writing gives the silence shape.”
                </p>
              </div>

              {/* Feedback messages */}
              {nameMessage.text && (
                <div
                  className={`mt-4 rounded-xl p-3 text-sm font-medium ${
                    nameMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {nameMessage.text}
                </div>
              )}

              {/* Edit Name Form */}
              {isEditingName && (
                <form
                  onSubmit={handleUpdateName}
                  className="mt-5 rounded-2xl border border-[#e9e2d7] bg-[#f8f6f1] p-5 sm:p-6"
                >
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-semibold text-[#172b3a]"
                  >
                    Display Name
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="profile-name"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full max-w-md rounded-xl border border-[#e9e2d7] bg-white px-4 py-2.5 text-sm text-[#172b3a] outline-none transition focus:border-[#b77945]"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={nameSaving}
                        className="text-xs"
                      >
                        {nameSaving ? "Saving…" : "Save Name"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(false)}
                        className="rounded-full px-4 py-2 text-xs font-semibold text-[#686b70] hover:text-[#172b3a]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Author Stats Grid */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b77945]">
              Total Stories
            </p>
            <p className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">
              {loading ? "…" : posts.length}
            </p>
            <p className="mt-1 text-xs text-[#686b70]">Penned for the journal</p>
          </div>

          <div className="rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Active in Journal
            </p>
            <p className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">
              {loading ? "…" : activeCount}
            </p>
            <p className="mt-1 text-xs text-[#686b70]">Public and readable</p>
          </div>

          <div className="rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a9b9d]">
              Drafts & Inactive
            </p>
            <p className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">
              {loading ? "…" : draftCount}
            </p>
            <p className="mt-1 text-xs text-[#686b70]">Work in progress</p>
          </div>

          <div className="rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b77945]">
              Total Words
            </p>
            <p className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a]">
              {loading ? "…" : totalWords.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#686b70]">Estimated words penned</p>
          </div>
        </section>

        {/* Stories Management Header */}
        <section className="mt-14">
          <div className="flex flex-col gap-6 border-b border-[#e9e2d7] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">
                Author Catalog
              </p>
              <h2 className="editorial-serif mt-2 text-3xl font-bold text-[#172b3a] sm:text-4xl">
                My Stories
              </h2>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex rounded-full border border-[#e9e2d7] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    filterStatus === "all"
                      ? "bg-[#172b3a] text-white shadow-sm"
                      : "text-[#686b70] hover:text-[#172b3a]"
                  }`}
                >
                  All ({posts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("active")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    filterStatus === "active"
                      ? "bg-[#172b3a] text-white shadow-sm"
                      : "text-[#686b70] hover:text-[#172b3a]"
                  }`}
                >
                  Published ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("inactive")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    filterStatus === "inactive"
                      ? "bg-[#172b3a] text-white shadow-sm"
                      : "text-[#686b70] hover:text-[#172b3a]"
                  }`}
                >
                  Drafts ({draftCount})
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-2.5 text-xs text-[#9a9b9d]">
                  ⌕
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter your stories…"
                  className="w-full rounded-full border border-[#e9e2d7] bg-white py-2 pl-8 pr-4 text-xs text-[#172b3a] outline-none transition focus:border-[#b77945] sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Stories List / Grid */}
          <div className="py-8">
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="h-64 animate-pulse rounded-2xl bg-[#e9e2d7]" />
                <div className="h-64 animate-pulse rounded-2xl bg-[#e9e2d7]" />
                <div className="h-64 animate-pulse rounded-2xl bg-[#e9e2d7]" />
              </div>
            )}

            {!loading && filteredPosts.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#e9e2d7] bg-white p-12 text-center sm:p-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f1] text-[#b77945] text-xl font-bold">
                  ✎
                </div>
                <h3 className="editorial-serif mt-5 text-2xl font-bold text-[#172b3a]">
                  {posts.length === 0
                    ? "Your story catalog is waiting."
                    : "No stories match your current filter."}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#686b70]">
                  {posts.length === 0
                    ? "You haven't written any stories yet. Put pen to paper and publish your first essay to The Letterform."
                    : "Try selecting a different filter tab or clearing your search keywords."}
                </p>
                {posts.length === 0 && (
                  <div className="mt-6">
                    <Link to="/add-post">
                      <Button>Write your first story →</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {!loading && filteredPosts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => {
                  const { minutes } = calculateReadingTime(post.content || "");
                  const isPostDeleting = isDeleting === post.$id;

                  return (
                    <article
                      key={post.$id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white shadow-[0_10px_35px_rgba(23,43,58,0.04)] transition hover:border-[#b77945]/40"
                    >
                      <div>
                        {/* Cover image or placeholder */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e9e2d7]">
                          {post.blogImage ? (
                            <img
                              src={appwriteService.getFileView(post.blogImage)}
                              alt={post.title}
                              loading="lazy"
                              className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[#686b70]">
                              No cover image
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute left-3 top-3">
                            {post.status === "active" ? (
                              <span className="rounded-full bg-emerald-50/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                                Published
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#f8f6f1]/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#686b70] border border-[#e9e2d7]">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Story Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#9a9b9d]">
                            <span>{minutes} min read</span>
                          </div>

                          <Link to={`/post/${post.$id}`}>
                            <h3 className="editorial-serif mt-2 line-clamp-2 text-xl font-bold leading-tight text-[#172b3a] transition group-hover:text-[#b77945]">
                              {post.title}
                            </h3>
                          </Link>

                          {post.content && (
                            <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-[#686b70]">
                              {getExcerpt(post.content)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Management Action Bar */}
                      <div className="flex items-center justify-between border-t border-[#e9e2d7] bg-[#f8f6f1]/50 px-5 py-3">
                        <Link
                          to={`/post/${post.$id}`}
                          className="text-xs font-semibold text-[#686b70] hover:text-[#172b3a]"
                        >
                          View story →
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link to={`/edit-post/${post.$id}`}>
                            <button
                              type="button"
                              className="rounded-full border border-[#e9e2d7] bg-white px-3 py-1 text-xs font-semibold text-[#172b3a] transition hover:border-[#b77945] hover:text-[#b77945]"
                            >
                              Edit
                            </button>
                          </Link>
                          <button
                            type="button"
                            disabled={isPostDeleting}
                            onClick={() => handleDeletePost(post)}
                            className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {isPostDeleting ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
