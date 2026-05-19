import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div className="not-found-page">
      <h2>404 — Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/?page=1" className="back-link">
        ← Return to main page
      </Link>
    </div>
  );
}

export default NotFoundPage;
