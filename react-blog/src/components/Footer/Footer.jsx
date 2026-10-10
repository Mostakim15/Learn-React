import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e9e2d7] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-3">
            <Logo width="42px" />
            <span className="editorial-serif text-lg font-bold text-[#172b3a]">The Letterform</span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-[#686b70]">
            Thoughtful stories for curious minds, written with care and made to last.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-[#686b70]">
          <Link to="/" className="transition hover:text-[#b77945]">Home</Link>
          <Link to="/all-posts" className="transition hover:text-[#b77945]">Stories</Link>
          <Link to="/help" className="transition hover:text-[#b77945]">Help</Link>
        </div>
        <p className="text-sm text-[#9a9b9d]">© 2026 The Letterform</p>
      </div>
    </footer>
  );
}

export default Footer;
