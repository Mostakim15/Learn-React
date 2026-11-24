import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import ReelCard from "../components/ReelCard";
import { Button, Container } from "../components";

const TOPICS = [
  "All",
  "Programming",
  "Web Development",
  "Science",
  "Math",
  "Design",
  "Productivity",
  "Quick Tips",
];

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    let active = true;
    appwriteService
      .getReels()
      .then((res) => {
        if (!active) return;
        if (res && res.documents) {
          setReels(res.documents);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error("Reels :: getReels :: error", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredReels = useMemo(() => {
    if (activeTopic === "All") return reels;
    return reels.filter(
      (r) => r.topic?.toLowerCase() === activeTopic.toLowerCase()
    );
  }, [reels, activeTopic]);

  // Track which reel is currently in center view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollCenter = container.scrollTop + container.clientHeight / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      reelRefs.current.forEach((el, index) => {
        if (!el) return;
        const elCenter = el.offsetTop + el.clientHeight / 2;
        const distance = Math.abs(scrollCenter - elCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = index;
        }
      });

      if (closestIdx !== activeIndex) {
        setActiveIndex(closestIdx);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [filteredReels, activeIndex]);

  const scrollToReel = (index) => {
    const target = reelRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDelete = (deletedId) => {
    setReels((prev) => prev.filter((r) => r.$id !== deletedId));
  };

  return (
    <main className="py-6 sm:py-10">
      <Container>
        {/* Header Bar */}
        <div className="flex flex-col gap-4 border-b border-[#e9e2d7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#b77945] animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">
                Educational Shorts
              </p>
            </div>
            <h1 className="editorial-serif mt-2 text-3xl font-bold text-[#172b3a] sm:text-4xl">
              EduReels
            </h1>
            <p className="mt-1 text-sm text-[#686b70]">
              60-second insights, concepts & tutorials worth your attention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/add-reel">
              <Button className="flex items-center gap-1.5 shadow-sm text-xs">
                <span>+</span> Upload Reel
              </Button>
            </Link>
          </div>
        </div>

        {/* Topic Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => {
                setActiveTopic(topic);
                setActiveIndex(0);
              }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeTopic === topic
                  ? "bg-[#172b3a] text-white shadow-sm"
                  : "border border-[#e9e2d7] bg-white text-[#686b70] hover:border-[#b77945] hover:text-[#172b3a]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Reels Content Container */}
        <div className="relative mt-6 flex justify-center">
          {/* Loading State */}
          {loading && (
            <div className="flex h-[78vh] w-full max-w-[420px] items-center justify-center rounded-3xl border border-[#e9e2d7] bg-[#f8f6f1]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e9e2d7] border-t-[#b77945]" />
                <p className="text-xs font-semibold text-[#686b70]">Loading reels…</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredReels.length === 0 && (
            <div className="my-12 flex max-w-md flex-col items-center rounded-3xl border border-dashed border-[#e9e2d7] bg-white p-10 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f6f1] text-2xl font-bold text-[#b77945]">
                ▶
              </div>
              <h2 className="editorial-serif mt-5 text-2xl font-bold text-[#172b3a]">
                No educational reels yet.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#686b70]">
                {activeTopic === "All"
                  ? "Be the first to share a concise educational video with the community."
                  : `No reels under "${activeTopic}" yet. Be the first to publish one!`}
              </p>
              <div className="mt-6">
                <Link to="/add-reel">
                  <Button>Publish an educational reel →</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Vertical Snap Scroll Reels Feed */}
          {!loading && filteredReels.length > 0 && (
            <div className="relative flex w-full justify-center">
              {/* Up/Down Desktop Floating Navigation Buttons */}
              <div className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => scrollToReel(Math.max(0, activeIndex - 1))}
                  aria-label="Previous reel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e9e2d7] bg-white text-[#172b3a] shadow-md transition hover:border-[#b77945] hover:text-[#b77945] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
                <div className="text-center text-xs font-bold text-[#9a9b9d]">
                  {activeIndex + 1}/{filteredReels.length}
                </div>
                <button
                  type="button"
                  disabled={activeIndex >= filteredReels.length - 1}
                  onClick={() => scrollToReel(Math.min(filteredReels.length - 1, activeIndex + 1))}
                  aria-label="Next reel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e9e2d7] bg-white text-[#172b3a] shadow-md transition hover:border-[#b77945] hover:text-[#b77945] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↓
                </button>
              </div>

              {/* Feed Snap Container */}
              <div
                ref={containerRef}
                className="flex h-[80vh] w-full max-w-[440px] flex-col gap-6 overflow-y-scroll snap-y snap-mandatory scroll-smooth py-2 scrollbar-none sm:h-[84vh]"
              >
                {filteredReels.map((reel, index) => (
                  <div
                    key={reel.$id}
                    ref={(el) => (reelRefs.current[index] = el)}
                    className="w-full shrink-0 snap-center"
                  >
                    <ReelCard
                      reel={reel}
                      userData={userData}
                      isActive={activeIndex === index}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
