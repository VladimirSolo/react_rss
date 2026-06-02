import { useState } from 'react';

function ErrorButton(): JSX.Element {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user');
  }

  return (
    <button
      className="error-trigger-btn"
      type="button"
      onClick={() => setShouldThrow(true)}
    >
      Throw Error
    </button>
  );
}

export default ErrorButton;
