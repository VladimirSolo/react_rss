import { useEffect, useState } from 'react';
import { FormSubmission } from '../../types';

interface Props {
  submission: FormSubmission;
}

const HIGHLIGHT_DURATION_MS = 3000;

export default function SubmissionCard({ submission }: Props) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const elapsed = Date.now() - submission.submittedAt;
    const delay = Math.max(0, HIGHLIGHT_DURATION_MS - elapsed);
    const timer = setTimeout(() => setIsNew(false), delay);
    return () => clearTimeout(timer);
  }, [submission.submittedAt]);

  return (
    <div
      className={`submission-card${isNew ? ' submission-card--new' : ''}`}
      data-testid="submission-card"
    >
      {submission.image && (
        <img
          src={submission.image}
          alt={`${submission.name}'s avatar`}
          className="submission-card__image"
        />
      )}
      <div className="submission-card__info">
        <h3 className="submission-card__name">{submission.name}</h3>
        <p>
          <strong>Age:</strong> {submission.age}
        </p>
        <p>
          <strong>Email:</strong> {submission.email}
        </p>
        <p>
          <strong>Gender:</strong> {submission.gender}
        </p>
        <p>
          <strong>Country:</strong> {submission.country}
        </p>
      </div>
    </div>
  );
}
