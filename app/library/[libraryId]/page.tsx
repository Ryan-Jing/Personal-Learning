import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionCard, NoteRow } from "@/components/LibraryUI";
import { collections, getLibrary, libraries, notes } from "@/content/library";

type LibraryPageProps = { params: Promise<{ libraryId: string }> };

export function generateStaticParams() {
  return libraries.map((library) => ({ libraryId: library.id }));
}

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { libraryId } = await params;
  const library = getLibrary(libraryId);
  if (!library) return {};
  return { title: library.title, description: library.description };
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { libraryId } = await params;
  const library = getLibrary(libraryId);
  if (!library) notFound();

  const libraryCollections = collections.filter((collection) => collection.libraryId === library.id);
  const libraryNotes = notes.filter((note) => note.libraryId === library.id);

  return (
    <div className="page library-page">
      <header className="library-hero">
        <div className={`hero-mark accent-${library.accent}`} aria-hidden="true">{library.mark}</div>
        <div>
          <p className="eyebrow">Library</p>
          <h1>{library.title}</h1>
          <p className="page-intro">{library.description}</p>
          <div className="library-stats">
            <span><strong>{libraryCollections.length}</strong> collections</span>
            <span><strong>{libraryNotes.length}</strong> notes</span>
            <span><strong>{libraryNotes.reduce((sum, note) => sum + note.readingTime, 0)}</strong> review minutes</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="collection-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Organized by subject</p>
            <h2 id="collection-heading">Collections</h2>
          </div>
        </div>
        <div className="collection-grid library-collection-grid">
          {libraryCollections.map((collection) => (
            <CollectionCard collection={collection} key={collection.id} />
          ))}
        </div>
      </section>

      <section className="all-notes" aria-labelledby="all-notes-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Everything on this shelf</p>
            <h2 id="all-notes-heading">All notes</h2>
          </div>
          <Link href="/" className="text-link">Back to overview</Link>
        </div>
        <div className="note-list">
          {libraryNotes.map((note) => <NoteRow note={note} key={note.slug} />)}
        </div>
      </section>
    </div>
  );
}
