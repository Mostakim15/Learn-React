import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function getExcerpt(content = "") {
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plainText.length > 120 ? `${plainText.slice(0, 120)}…` : plainText;
}

function PostCard({ $id, title, blogImage, content, featured = false }) {
  return (
    <Link to={`/post/${$id}`} className={`group block ${featured ? "md:col-span-2" : ""}`}>
      <article className="motion-safe h-full overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white shadow-[0_10px_35px_rgba(23,43,58,0.04)]">
        <div className={`relative overflow-hidden bg-[#e9e2d7] ${featured ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
          {blogImage ? (
            <img
              src={appwriteService.getFileView(blogImage)}
              alt=""
              loading={featured ? "eager" : "lazy"}
              className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#686b70]">No cover image</div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-[#f8f6f1]/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b77945]">
            Essay
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <h2 className={`editorial-serif font-bold leading-tight text-[#172b3a] group-hover:text-[#b77945] ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
            {title}
          </h2>
          {content && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#686b70]">{getExcerpt(content)}</p>}
          <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#9a9b9d]">
            <span>Read story</span>
            <span className="text-[#b77945] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
