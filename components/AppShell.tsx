"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/content/library";

const primaryNav = [
  { href: "/", label: "Overview", glyph: "⌂" },
  { href: "/library/technical", label: "Technical library", glyph: "⌁" },
  { href: "/library/personal", label: "Personal library", glyph: "◇" },
];

function breadcrumbFor(pathname: string) {
  if (pathname === "/") return ["Library", "Overview"];
  if (pathname.includes("/library/technical")) return ["Library", "Technical"];
  if (pathname.includes("/library/personal")) return ["Library", "Personal"];
  if (pathname.startsWith("/collections/")) return ["Library", "Collection"];
  if (pathname.startsWith("/notes/")) return ["Library", "Study note"];
  return ["Library"];
}

export function AppShell({ children, searchEntries }: { children: React.ReactNode; searchEntries: SearchEntry[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [peek, setPeek] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const breadcrumbs = breadcrumbFor(pathname);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);
  const setCollapsedPersisted = useCallback((next: boolean) => {
    setCollapsed(next);
    setPeek(false);
    try {
      window.localStorage.setItem("sidebar-collapsed", String(next));
    } catch {
      // ignore storage failures (private mode, disabled storage)
    }
  }, []);

  useEffect(() => {
    // Restore the persisted preference after hydration; a lazy initializer
    // would read differently on the server and mismatch the rendered HTML.
    try {
      if (window.localStorage.getItem("sidebar-collapsed") === "true") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCollapsed(true);
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (searchOpen) closeSearch();
        else setSearchOpen(true);
      }
      if (event.key === "Escape") {
        closeSearch();
        closeMenu();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, closeSearch, searchOpen]);

  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [searchOpen]);

  // While the sidebar is collapsed, reveal it when a mouse approaches the left
  // ~10% of the viewport. This is proximity-only (no DOM overlay), so page
  // content stays fully clickable, and it is gated to fine-pointer desktops —
  // touch devices (e.g. iPad) never fire this and rely on the reveal button.
  useEffect(() => {
    if (!collapsed) return;
    const pointerQuery = window.matchMedia("(min-width: 921px) and (pointer: fine)");
    if (!pointerQuery.matches) return;
    const SIDEBAR_WIDTH = 264;
    function onMouseMove(event: MouseEvent) {
      if (event.clientX <= window.innerWidth * 0.1) setPeek(true);
      else if (event.clientX > SIDEBAR_WIDTH) setPeek(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [collapsed]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchEntries.slice(0, 6);
    return searchEntries
      .filter((entry) => `${entry.title} ${entry.summary} ${entry.collection}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query, searchEntries]);

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""} ${collapsed && peek ? "is-peeking" : ""}`}>
      <button
        className={`mobile-scrim ${menuOpen ? "is-visible" : ""}`}
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <button
        className="sidebar-peek-trigger"
        aria-label="Show sidebar"
        onClick={() => setCollapsedPersisted(false)}
      >
        <span aria-hidden="true">»</span>
      </button>
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="sidebar-head">
          <Link href="/" className="brand" aria-label="Commonplace home">
            <span className="brand-mark" aria-hidden="true" />
            <span>
              <strong>Commonplace</strong>
              <small>Personal learning library</small>
            </span>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsedPersisted(!collapsed)}
            aria-label={collapsed ? "Keep sidebar open" : "Hide sidebar"}
            title={collapsed ? "Keep sidebar open" : "Hide sidebar"}
          >
            <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
          </button>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {primaryNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link href={item.href} className={active ? "is-active" : ""} key={item.href} onClick={closeMenu}>
                <span className={`nav-glyph${item.href === "/library/technical" ? " mark-rotate" : ""}`} aria-hidden="true">{item.glyph}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="sidebar-collections" aria-label="Pinned collections">
          <p className="nav-label">Pinned collections</p>
          <Link href="/collections/electrical-fundamentals" onClick={closeMenu}><span className="pin pin-yellow" />Electrical fundamentals</Link>
          <Link href="/collections/pcb-design" onClick={closeMenu}><span className="pin pin-orange" />PCB design</Link>
          <Link href="/collections/embedded-firmware" onClick={closeMenu}><span className="pin pin-aqua" />Embedded &amp; firmware</Link>
        </nav>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button>
          <div className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb}>
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === breadcrumbs.length - 1 ? <strong>{crumb}</strong> : crumb}
              </span>
            ))}
          </div>
          <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search library">
            <span aria-hidden="true">⌕</span>
            <span>Search your library</span>
            <kbd>⌘ K</kbd>
          </button>
        </header>
        {children}
      </main>

      {searchOpen && (
        <div className="search-backdrop" role="presentation" onMouseDown={closeSearch}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search your library" onMouseDown={(event) => event.stopPropagation()}>
            <div className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search concepts, books, or projects…"
                aria-label="Search concepts, books, or projects"
              />
              <button onClick={closeSearch} aria-label="Close search">Esc</button>
            </div>
            <div className="search-results">
              <p className="nav-label">{query ? `${results.length} results` : "Suggested notes"}</p>
              {results.length ? results.map((result) => (
                <Link href={`/notes/${result.slug}`} key={result.slug} onClick={closeSearch}>
                  <span className={`result-mark accent-${result.accent}`} aria-hidden="true">{result.mark}</span>
                  <span>
                    <strong>{result.title}</strong>
                    <small>{result.collection} · {result.summary}</small>
                  </span>
                  <span aria-hidden="true">↵</span>
                </Link>
              )) : (
                <div className="no-results">
                  <strong>No note matches that search.</strong>
                  <span>Try a broader concept such as “power”, “RTOS”, or “project”.</span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
