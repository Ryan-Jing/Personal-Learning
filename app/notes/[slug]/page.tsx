import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteRenderer } from "@/components/NoteRenderer";
import { collections, getNote, notes } from "@/content/library";

type NotePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((candidate) => candidate.slug === slug);
  if (!note) return {};
  return { title: note.title, description: note.summary };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const collection = collections.find((candidate) => candidate.id === note.collectionId);

  return (
    <div className="page note-page">
      <header className="note-header">
        <Link href={`/collections/${note.collectionId}`} className="back-link">
          <span aria-hidden="true">←</span> All {collection?.title} notes
        </Link>
        <div className="note-heading-grid">
          <div>
            <p className="eyebrow">{collection?.title}</p>
            <h1>{note.title}</h1>
            <p className="page-intro">{note.summary}</p>
          </div>
          <div className="note-status-card">
            <span className="status-dot" />
            <div>
              <small>Learning state</small>
              <strong>{note.stage}</strong>
            </div>
          </div>
        </div>
        <div className="note-meta">
          <span>{note.readingTime} min review</span>
          <span>Updated {note.updatedAt}</span>
          <span>{note.sources.length} sources</span>
        </div>
      </header>

      <div className="note-layout">
        <article className="note-article">
          <NoteRenderer blocks={note.blocks} />
        </article>

        <aside className="note-aside">
          <nav className="on-this-page" aria-label="On this page">
            <p className="aside-label">On this page</p>
            {note.blocks.map((block, index) => (
              block.heading ? <a href={`#section-${index}`} key={`${block.heading}-${index}`}>{block.heading}</a> : null
            ))}
          </nav>

          <section className="source-panel">
            <p className="aside-label">Sources &amp; resources</p>
            {note.sources.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>{source.kind}</span>
                <strong>{source.title}</strong>
                <small>{source.publisher}</small>
              </a>
            ))}
          </section>

          <Link href={`/collections/${note.collectionId}`} className="return-to-collection">
            <span aria-hidden="true">←</span>
            <span><small>Return to collection</small><strong>{collection?.title}</strong></span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
