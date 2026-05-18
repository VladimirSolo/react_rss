import { Link } from 'react-router-dom';

function AboutPage(): JSX.Element {
  return (
    <div className="about-page">
      <h2>About</h2>
      <p>
        This application was built as part of the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>
        .
      </p>
      <p>
        <strong>Author:</strong> Vladimir Solo
      </p>
      <p>
        It uses the{' '}
        <a
          href="https://rickandmortyapi.com"
          target="_blank"
          rel="noreferrer"
        >
          Rick &amp; Morty API
        </a>{' '}
        to display characters with search and pagination.
      </p>
      <Link to="/?page=1" className="back-link">
        ← Back to main page
      </Link>
    </div>
  );
}

export default AboutPage;
