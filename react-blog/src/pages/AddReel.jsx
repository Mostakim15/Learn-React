import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { Button, Container, Input } from "../components";

const POPULAR_TOPICS = [
  "Programming",
  "Web Development",
  "Science",
  "Math",
  "Design",
  "Productivity",
  "Quick Tips",
];

export default function AddReel() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState(POPULAR_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file (MP4, WebM, etc.).");
        return;
      }
      setError("");
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleRemoveVideo = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Please provide a title for this educational reel.");
      return;
    }
    if (!userData?.$id) {
      setError("You must be signed in to upload a reel.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 1. Upload video file to Appwrite storage bucket
      const uploadedFile = await appwriteService.uploadFile(videoFile);
      if (!uploadedFile?.$id) {
        throw new Error("Video file upload failed. Please try again.");
      }

      // 2. Determine final topic
      const finalTopic = topic === "Other" && customTopic.trim() ? customTopic.trim() : topic;

      // 3. Create document in reels collection
      const reelDoc = await appwriteService.createReel({
        title: title.trim(),
        description: description.trim(),
        videoFileId: uploadedFile.$id,
        topic: finalTopic,
        userId: userData.$id,
        authorName: userData.name || "Educator",
      });

      if (reelDoc) {
        navigate("/reels");
      } else {
        throw new Error("Failed to save reel details.");
      }
    } catch (err) {
      console.error("AddReel :: submit :: error", err);
      setError(err?.message || "An error occurred while uploading your reel.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb & Heading */}
          <div className="mb-8 border-b border-[#e9e2d7] pb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">
              <Link to="/reels" className="hover:underline">EduReels</Link>
              <span className="text-[#e9e2d7]">/</span>
              <span>New Educational Short</span>
            </div>
            <h1 className="editorial-serif mt-3 text-4xl font-bold text-[#172b3a] sm:text-5xl">
              Share a bite-sized lesson.
            </h1>
            <p className="mt-2 text-sm text-[#686b70]">
              Upload a concise 15–90 second vertical video explaining a key concept, tip, or tutorial.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Input
                  label="Reel Title *"
                  placeholder="e.g. How CSS Grid Actually Works in 60s"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Topic */}
              <div>
                <label className="mb-2 inline-block text-sm font-semibold text-[#172b3a]">
                  Educational Topic *
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#e9e2d7] bg-white px-4 py-3 text-sm text-[#172b3a] outline-none transition focus:border-[#b77945]"
                >
                  {POPULAR_TOPICS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                  <option value="Other">Other (Custom topic)</option>
                </select>

                {topic === "Other" && (
                  <div className="mt-3">
                    <Input
                      placeholder="Type custom topic (e.g., Biology, Economics)"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 inline-block text-sm font-semibold text-[#172b3a]">
                  Key Takeaways / Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain what viewers will learn from this short..."
                  className="w-full rounded-xl border border-[#e9e2d7] bg-white p-4 text-sm text-[#172b3a] outline-none transition placeholder:text-[#9a9b9d] focus:border-[#b77945]"
                  maxLength={1000}
                />
                <p className="mt-1 text-right text-xs text-[#9a9b9d]">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full shadow-sm"
                >
                  {uploading ? "Uploading & Publishing…" : "Publish Reel →"}
                </Button>
                {uploading && (
                  <p className="mt-2 text-center text-xs text-[#686b70]">
                    Uploading video to your storage bucket, please do not close this tab…
                  </p>
                )}
              </div>
            </div>

            {/* Video File Picker & Live 9:16 Preview */}
            <div className="flex flex-col items-center rounded-3xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
              <div className="mb-3 flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-[#172b3a]">
                  Vertical Video File *
                </span>
                {videoFile && (
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    title="Remove selected video"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <div className="relative aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-dashed border-[#e9e2d7] bg-[#f8f6f1] transition hover:border-[#b77945]">
                {videoPreview ? (
                  <div className="relative h-full w-full group">
                    <video
                      src={videoPreview}
                      controls
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-[#b77945]"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="rounded-full bg-red-600/80 p-1 text-white backdrop-blur transition hover:bg-red-700"
                        title="Remove video"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-full w-full flex-col items-center justify-center p-6 text-center focus:outline-none"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#b77945] shadow-sm">
                      📹
                    </span>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#172b3a]">
                      Select video
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#686b70]">
                      MP4 or WebM (vertical 9:16 format looks best)
                    </p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4, video/webm, video/quicktime"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </div>

              {videoFile && (
                <div className="mt-3 flex w-full max-w-[280px] items-center justify-between gap-2 rounded-xl border border-[#e9e2d7] bg-[#f8f6f1] px-3 py-1.5 text-xs">
                  <span className="truncate text-[#172b3a] font-medium" title={videoFile.name}>
                    {videoFile.name}
                  </span>
                  <span className="shrink-0 text-[#686b70]">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}
