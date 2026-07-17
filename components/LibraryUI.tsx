import Link from "next/link";
import { collections, type Collection, type Note } from "@/content/library";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label"><span>{label}</span><strong>{value}%</strong></div>
      <div className="progress-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

export function CollectionCard({ collection, compact = false }: { collection: Collection; compact?: boolean }) {
  return (
    <Link href={`/collections/${collection.id}`} className={`collection-card ${compact ? "is-compact" : ""}`}>
      <div className="collection-card-top">
        <span className={`collection-mark accent-${collection.accent}`} aria-hidden="true">{collection.mark}</span>
        <span className="card-arrow" aria-hidden="true">↗</span>
      </div>
      <div>
        <h3>{collection.title}</h3>
        <p>{collection.description}</p>
      </div>
      <div className="collection-card-meta">
        <span>{collection.noteSlugs.length} notes</span>
        <span>·</span>
        <span>{collection.focus}</span>
      </div>
    </Link>
  );
}

export function CollectionNoteCard({ note, index }: { note: Note; index: number }) {
  return (
    <Link href={`/notes/${note.slug}`} className="collection-note-card">
      <div className="collection-note-number">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <p className="section-kicker">{note.stage}</p>
        <h2>{note.title}</h2>
      </div>
      <div className="collection-note-meta">
        <span>{note.readingTime} min review</span>
        <span>Updated {note.updatedAt}</span>
        <span className="card-arrow" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export function NoteRow({ note }: { note: Note }) {
  const collection = collections.find((candidate) => candidate.id === note.collectionId);
  return (
    <Link href={`/notes/${note.slug}`} className="note-row">
      <span className={`note-row-mark accent-${collection?.accent ?? "yellow"}`} aria-hidden="true">
        {collection?.mark ?? "·"}
      </span>
      <span className="note-row-copy">
        <strong>{note.title}</strong>
        <small>{collection?.title} · Updated {note.updatedAt}</small>
      </span>
      <span className="note-row-summary">{note.summary}</span>
      <span className="note-row-time">{note.readingTime} min</span>
      <span className="card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
