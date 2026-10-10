import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";

function Help() {
  return (
    <main className="py-14 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">Help center</p>
          <h1 className="editorial-serif mt-3 text-5xl font-bold text-[#172b3a]">A short guide to publishing.</h1>
          <p className="mt-5 text-lg leading-8 text-[#686b70]">
            A few practical notes to help your stories look their best and publish without surprises.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <section id="featured-image" className="scroll-mt-28 rounded-2xl border border-[#e9e2d7] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b77945]">01 / Images</p>
            <h2 className="editorial-serif mt-3 text-2xl font-bold text-[#172b3a]">Choosing a cover image</h2>
            <p className="mt-3 text-sm leading-7 text-[#686b70]">
              Use a sharp JPG, PNG, or GIF. A landscape image around 1600 × 900 pixels is a good starting point. The site preserves the complete image, so important details near the edges will not be cut off.
            </p>
            <Link to="/add-post#featured-image" className="mt-5 inline-block text-sm font-bold text-[#b77945] hover:underline">
              Return to the image field →
            </Link>
          </section>

          <section id="writing" className="scroll-mt-28 rounded-2xl border border-[#e9e2d7] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b77945]">02 / Writing</p>
            <h2 className="editorial-serif mt-3 text-2xl font-bold text-[#172b3a]">Making a readable story</h2>
            <p className="mt-3 text-sm leading-7 text-[#686b70]">
              Keep the title specific, use short paragraphs, and add headings when your idea changes direction. The editor supports lists, links, images, and rich text.
            </p>
            <Link to="/add-post#writing" className="mt-5 inline-block text-sm font-bold text-[#b77945] hover:underline">
              Start writing →
            </Link>
          </section>

          <section id="publishing" className="scroll-mt-28 rounded-2xl border border-[#e9e2d7] bg-white p-6 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b77945]">03 / Publishing</p>
            <h2 className="editorial-serif mt-3 text-2xl font-bold text-[#172b3a]">When something goes wrong</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#686b70]">
              If an image does not appear, check that the upload completed and try editing the story to upload it again. If saving fails, confirm that you are signed in and try once more.
            </p>
            <Link to="/all-posts" className="mt-5 inline-block text-sm font-bold text-[#b77945] hover:underline">
              Browse published stories →
            </Link>
          </section>
        </div>
      </Container>
    </main>
  );
}

export default Help;
