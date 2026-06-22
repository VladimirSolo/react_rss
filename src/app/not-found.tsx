import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="not-found-page">
          <h2>404 — Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <Link href="/" className="back-link">
            ← Return to main page
          </Link>
        </div>
      </body>
    </html>
  );
}
