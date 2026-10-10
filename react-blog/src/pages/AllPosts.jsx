import React, { useEffect, useMemo, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    appwriteService.getPosts([]).then((result) => {
      if (!active) return;
      if (result) setPosts(result.documents || []);
      else setError("We could not load the journal. Please try again.");
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return posts;
    return posts.filter((post) => `${post.title} ${post.content}`.toLowerCase().includes(normalized));
  }, [posts, query]);

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-8 border-b border-[#e9e2d7] pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">The journal</p>
            <h1 className="editorial-serif mt-3 text-5xl font-bold text-[#172b3a]">All stories</h1>
            <p className="mt-4 max-w-xl leading-7 text-[#686b70]">Browse every essay and observation from our growing collection.</p>
          </div>
          <label className="relative block w-full md:max-w-xs">
            <span className="sr-only">Search stories</span>
            <span className="pointer-events-none absolute left-4 top-3.5 text-[#9a9b9d]" aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories"
              className="w-full rounded-full border border-[#e9e2d7] bg-white py-3 pl-10 pr-4 text-sm text-[#172b3a] outline-none transition focus:border-[#b77945]"
            />
          </label>
        </div>

        <div className="py-10">
          {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div className="h-96 animate-pulse rounded-2xl bg-[#e9e2d7]" /><div className="h-96 animate-pulse rounded-2xl bg-[#e9e2d7]" /><div className="h-96 animate-pulse rounded-2xl bg-[#e9e2d7]" /></div>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#e9e2d7] p-14 text-center">
              <h2 className="editorial-serif text-2xl font-bold text-[#172b3a]">{query ? "No stories match that search." : "No stories yet."}</h2>
              <p className="mt-2 text-[#686b70]">{query ? "Try a different title or keyword." : "New perspectives are on the way."}</p>
            </div>
          )}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => <PostCard key={post.$id} {...post} />)}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

export default AllPosts;
