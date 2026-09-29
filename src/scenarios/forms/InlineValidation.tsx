import { useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR = 'Enter a valid email address, like name@example.com';

function useEmailField() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const validate = () => setError(EMAIL_PATTERN.test(value) ? '' : ERROR);
  return { value, setValue, error, validate };
}

// A second focusable control, so tests and keyboard users have somewhere to
// move focus to (triggering blur validation).
function CheckButton({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <button type="button" className="btn" data-testid="check" onClick={onClick}>
        Check email
      </button>
    </div>
  );
}

export function Accessible() {
  const { value, setValue, error, validate } = useEmailField();
  return (
    <div className="stack">
      <label htmlFor="email">Email address</label>
      <p id="email-hint" className="hint">
        We will only use this to send your receipt.
      </p>
      <input
        id="email"
        type="email"
        autoComplete="email"
        className={error ? 'input-error' : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'email-hint email-error' : 'email-hint'}
        data-testid="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={validate}
      />
      {error && (
        <p id="email-error" className="error" data-testid="error">
          {error}
        </p>
      )}
      <CheckButton onClick={validate} />
    </div>
  );
}

export function Broken() {
  const { value, setValue, error, validate } = useEmailField();
  return (
    <div className="stack">
      <label htmlFor="email">Email address</label>
      <p className="hint">We will only use this to send your receipt.</p>
      <input
        id="email"
        type="email"
        autoComplete="email"
        className={error ? 'input-error' : undefined}
        data-testid="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={validate}
      />
      {error && (
        <p className="error" data-testid="error">
          {error}
        </p>
      )}
      <CheckButton onClick={validate} />
    </div>
  );
}
