import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    appwriteService.getPosts().then((result) => {
      if (!active) return;
      if (result) setPosts(result.documents || []);
      else setError("Stories could not be loaded right now.");
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const featuredPost = posts[0];

  return (
    <div>
      <section className="border-b border-[#e9e2d7]">
        <Container>
          <div className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#b77945]">An independent journal</p>
              <h1 className="editorial-serif max-w-3xl text-5xl font-bold leading-[0.98] tracking-tight text-[#172b3a] sm:text-7xl">
                Ideas worth <em className="font-normal text-[#b77945]">sitting with.</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#686b70]">
                The Letterform is a quiet corner for essays, observations, and stories that reward a slower read.
              </p>
              <Link to="/all-posts" className="mt-8 inline-block">
                <Button>Explore the journal <span className="ml-2">→</span></Button>
              </Link>
            </div>
            <div className="border-l-2 border-[#b77945] pl-6 lg:mb-2">
              <p className="editorial-serif text-2xl leading-9 text-[#172b3a]">
                “Good writing does not rush to fill the silence. It gives the silence shape.”
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#9a9b9d]">The editorial note</p>
            </div>
          </div>
        </Container>
      </section>

      <main>
        <Container>
          <div className="py-14 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">From the journal</p>
                <h2 className="editorial-serif mt-2 text-4xl font-bold text-[#172b3a]">Featured reading</h2>
              </div>
              <Link to="/all-posts" className="hidden text-sm font-bold text-[#b77945] hover:underline sm:block">View all stories →</Link>
            </div>

            {loading && <div className="grid gap-6 md:grid-cols-2"><div className="h-96 animate-pulse rounded-2xl bg-[#e9e2d7]" /><div className="h-96 animate-pulse rounded-2xl bg-[#e9e2d7]" /></div>}
            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
            {!loading && !error && !featuredPost && (
              <div className="rounded-2xl border border-dashed border-[#e9e2d7] p-12 text-center">
                <h3 className="editorial-serif text-2xl font-bold text-[#172b3a]">The first story is waiting to be written.</h3>
                <p className="mt-2 text-[#686b70]">Check back soon for a new perspective.</p>
              </div>
            )}
            {!loading && !error && featuredPost && (
              <div className="grid gap-6 md:grid-cols-2">
                <PostCard {...featuredPost} featured />
                {posts[1] && <PostCard {...posts[1]} />}
              </div>
            )}
          </div>

          {posts.length > 2 && (
            <section className="border-t border-[#e9e2d7] py-14 sm:py-20">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="editorial-serif text-4xl font-bold text-[#172b3a]">Latest stories</h2>
                <Link to="/all-posts" className="text-sm font-bold text-[#b77945] hover:underline">Browse all →</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(2).map((post) => <PostCard key={post.$id} {...post} />)}
              </div>
            </section>
          )}
        </Container>
      </main>
    </div>
  );
}

export default Home;
