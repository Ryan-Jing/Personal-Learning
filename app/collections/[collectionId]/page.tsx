import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionNoteCard } from "@/components/LibraryUI";
import { collections, getLibrary, notes } from "@/content/library";

type CollectionPageProps = { params: Promise<{ collectionId: string }> };

export function generateStaticParams() {
  return collections.map((collection) => ({ collectionId: collection.id }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = collections.find((candidate) => candidate.id === collectionId);
  if (!collection) return {};
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionId } = await params;
  const collection = collections.find((candidate) => candidate.id === collectionId);
  if (!collection) notFound();

  const library = getLibrary(collection.libraryId);
  const collectionNotes = collection.noteSlugs
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter((note) => note !== undefined);

  return (
    <div className="page collection-page">
      <Link href={`/library/${collection.libraryId}`} className="back-link">
        <span aria-hidden="true">←</span> {library?.title}
      </Link>
      <header className="collection-hero">
        <div className={`hero-mark accent-${collection.accent}`} aria-hidden="true">{collection.mark}</div>
        <div>
          <p className="eyebrow">{library?.title} · Collection</p>
          <h1>{collection.title}</h1>
          <p className="page-intro">{collection.description}</p>
          <div className="library-stats">
            <span><strong>{collectionNotes.length}</strong> independent notes</span>
            <span><strong>{collectionNotes.reduce((sum, note) => sum + note.readingTime, 0)}</strong> review minutes</span>
            <span><strong>{collection.focus}</strong></span>
          </div>
        </div>
      </header>

      <section aria-labelledby="collection-pages-heading">
        <div className="section-heading-row collection-pages-heading">
          <div>
            <p className="section-kicker">Choose a page</p>
            <h2 id="collection-pages-heading">All notes in this collection</h2>
          </div>
          <span className="collection-page-count">{collectionNotes.length} pages</span>
        </div>
        <div className="collection-note-grid">
          {collectionNotes.map((note, index) => (
            <CollectionNoteCard note={note} index={index} key={note.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
