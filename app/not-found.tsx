import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page empty-state">
      <span className="empty-mark">?</span>
      <p className="eyebrow">Not found</p>
      <h1>This note is not on the shelf.</h1>
      <p>It may have moved, or it has not been written yet.</p>
      <Link href="/" className="button button-primary">Return to the library</Link>
    </div>
  );
}
