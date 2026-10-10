import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Logo, LogoutBtn } from "../index.js";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = authStatus
    ? [
        { name: "All stories", slug: "/all-posts" },
        { name: "Write", slug: "/add-post" },
      ]
    : [];

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e2d7] bg-[#f8f6f1]/95 backdrop-blur">
      <Container>
        <nav className="flex min-h-[76px] items-center justify-between gap-6" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <Logo width="48px" />
            <span className="hidden editorial-serif text-xl font-bold tracking-tight text-[#172b3a] sm:block">
              The Letterform
            </span>
          </Link>

          <button
            type="button"
            className="rounded-full border border-[#e9e2d7] p-2.5 text-[#172b3a] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="my-1.5 block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </button>

          <div className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-[76px] flex-col gap-2 border-b border-[#e9e2d7] bg-[#f8f6f1] p-5 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:text-[#b77945] ${location.pathname === "/" ? "text-[#b77945]" : "text-[#686b70]"}`}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <button
                type="button"
                key={item.slug}
                onClick={() => goTo(item.slug)}
                className={`rounded-full px-4 py-2 text-left text-sm font-semibold transition hover:text-[#b77945] ${location.pathname.startsWith(item.slug) ? "text-[#b77945]" : "text-[#686b70]"}`}
              >
                {item.name}
              </button>
            ))}
            <div className="mt-2 flex gap-2 border-t border-[#e9e2d7] pt-4 md:mt-0 md:border-0 md:pt-0">
              {!authStatus ? (
                <>
                  <button type="button" onClick={() => goTo("/login")} className="rounded-full px-4 py-2 text-sm font-semibold text-[#686b70] hover:text-[#b77945]">Sign in</button>
                  <button type="button" onClick={() => goTo("/signup")} className="rounded-full bg-[#172b3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27485d]">Join free</button>
                </>
              ) : (
                <LogoutBtn />
              )}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
