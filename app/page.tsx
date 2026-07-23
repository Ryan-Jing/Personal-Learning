import { CollectionCard } from "@/components/LibraryUI";
import { collections, libraries, notes } from "@/content/library";
import Link from "next/link";

export default function Home() {
  return (
    <div className="page dashboard-page">
      <header className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">Your private learning system</p>
          <h1>Welcome back, Ryan.</h1>
          <p className="page-intro">
            Browse the shelves and pick up a thread.
          </p>
        </div>
        <div className="dashboard-date" aria-label="Today">
          <span>{new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date())}</span>
          <strong>{new Intl.DateTimeFormat("en", { day: "2-digit" }).format(new Date())}</strong>
          <span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date())}</span>
        </div>
      </header>

      <section aria-labelledby="libraries-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Browse by shelf</p>
            <h2 id="libraries-heading">Libraries</h2>
          </div>
        </div>
        <div className="library-summary-grid">
          {libraries.map((library) => {
            const libraryCollections = collections.filter(
              (collection) => collection.libraryId === library.id,
            );
            const libraryNotes = notes.filter((note) => note.libraryId === library.id);
            return (
              <Link
                href={`/library/${library.id}`}
                className="library-summary-card"
                key={library.id}
              >
                <span className={`library-mark accent-${library.accent}${library.id === "technical" ? " mark-rotate" : ""}`} aria-hidden="true">
                  {library.mark}
                </span>
                <span>
                  <strong>{library.title}</strong>
                  <small>
                    {libraryCollections.length} collections · {libraryNotes.length} notes
                  </small>
                </span>
                <span className="card-arrow" aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {libraries.map((library) => (
        <section className="collection-strip" aria-labelledby={`${library.id}-collections-heading`} key={library.id}>
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">{library.title}</p>
              <h2 id={`${library.id}-collections-heading`}>Core collections</h2>
            </div>
            <Link href={`/library/${library.id}`} className="text-link">
              Browse all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="collection-grid">
            {collections
              .filter((collection) => collection.libraryId === library.id)
              .map((collection) => (
                <CollectionCard collection={collection} key={collection.id} compact />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
