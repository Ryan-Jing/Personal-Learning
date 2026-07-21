import Link from "next/link";
import { CollectionCard, NoteRow, ProgressBar } from "@/components/LibraryUI";
import { collections, getNote, libraries, notes } from "@/content/library";

export default function Home() {
  const featured = getNote("voltage-current-resistance");
  const recent = notes.slice(0, 4);
  const studyQueue = [
    getNote("rtos-task-scheduling"),
    getNote("return-paths-and-stackup"),
    getNote("engineering-judgment"),
  ];

  return (
    <div className="page dashboard-page">
      <header className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">Your private learning system</p>
          <h1>Welcome back, Ryan.</h1>
          <p className="page-intro">
            Pick up a thread, review a foundation, or follow a question.
          </p>
        </div>
        <div className="dashboard-date" aria-label="Today">
          <span>{new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date())}</span>
          <strong>{new Intl.DateTimeFormat("en", { day: "2-digit" }).format(new Date())}</strong>
          <span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date())}</span>
        </div>
      </header>

      <section className="continue-card" aria-labelledby="continue-heading">
        <div className="continue-copy">
          <p className="section-kicker">Continue studying</p>
          <h2 id="continue-heading">{featured.title}</h2>
          <p>{featured.summary}</p>
          <div className="continue-meta">
            <span>{featured.readingTime} min review</span>
            <span aria-hidden="true">·</span>
            <span>Electrical fundamentals</span>
          </div>
          <ProgressBar value={68} label="Review progress" />
        </div>
        <div className="continue-visual" aria-hidden="true">
          <div className="circuit-line circuit-line-top" />
          <div className="circuit-node node-source">V</div>
          <div className="circuit-resistor">
            <span>R</span>
          </div>
          <div className="circuit-node node-current">I</div>
          <div className="circuit-line circuit-line-bottom" />
          <span className="circuit-equation">V = I × R</span>
        </div>
        <Link className="button button-primary continue-action" href={`/notes/${featured.slug}`}>
          Resume note <span aria-hidden="true">→</span>
        </Link>
      </section>

      <div className="dashboard-grid">
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

          <div className="section-heading-row recent-heading">
            <div>
              <p className="section-kicker">Recently updated</p>
              <h2>Notes</h2>
            </div>
            <Link href="/library/technical" className="text-link">
              Browse all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="note-list">
            {recent.map((note) => (
              <NoteRow key={note.slug} note={note} />
            ))}
          </div>
        </section>

        <aside className="study-queue" aria-labelledby="queue-heading">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Next up</p>
              <h2 id="queue-heading">Study queue</h2>
            </div>
            <span className="queue-count">{studyQueue.length}</span>
          </div>
          <ol>
            {studyQueue.map((note, index) => (
              <li key={note.slug}>
                <span className="queue-index">0{index + 1}</span>
                <Link href={`/notes/${note.slug}`}>
                  <strong>{note.title}</strong>
                  <small>{note.readingTime} min · {note.stage}</small>
                </Link>
              </li>
            ))}
          </ol>
          <div className="queue-footnote">
            <span className="status-dot" />
            <p>
              Your library is source-controlled. New material can be reviewed before it is published.
            </p>
          </div>
        </aside>
      </div>

      <section className="collection-strip" aria-labelledby="collections-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Technical library</p>
            <h2 id="collections-heading">Core collections</h2>
          </div>
        </div>
        <div className="collection-grid">
          {collections.filter((collection) => collection.libraryId === "technical").map((collection) => (
            <CollectionCard collection={collection} key={collection.id} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
