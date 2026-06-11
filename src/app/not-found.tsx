import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page page--not-found">
      <div className="not-found-card">
        <span className="eyebrow">Route Missing</span>
        <h1>That arcade room does not exist yet.</h1>
        <p>
          The catalog route was requested, but no matching game or section has been
          wired in this scaffold.
        </p>
        <Link href="/" className="button button--primary">
          Return Home
        </Link>
      </div>
    </main>
  );
}
