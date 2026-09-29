import { FormEvent, useEffect, useRef, useState } from 'react';

interface Errors {
  name?: string;
  email?: string;
}

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const errors: Errors = {};
  if (!String(data.get('name') ?? '').trim()) errors.name = 'Enter your name';
  if (!String(data.get('email') ?? '').trim()) errors.email = 'Enter your email address';
  return errors;
}

export function Accessible() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitCount, setSubmitCount] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors) as [keyof Errors, string][];

  useEffect(() => {
    if (submitCount > 0 && entries.length > 0) summaryRef.current?.focus();
    // Focus on every submit that produces errors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(validate(e.currentTarget));
    setSubmitCount((n) => n + 1);
  };

  const focusField = (id: string) => document.getElementById(`summary-${id}`)?.focus();

  return (
    <form noValidate className="stack" onSubmit={onSubmit}>
      {entries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="error-summary"
          aria-labelledby="summary-title"
          role="group"
          data-testid="error-summary"
        >
          <h2 id="summary-title">
            There {entries.length === 1 ? 'is 1 problem' : `are ${entries.length} problems`} with your submission
          </h2>
          <ul>
            {entries.map(([field, message]) => (
              <li key={field}>
                {/* preventDefault keeps the hash router from treating this as navigation */}
                <a
                  href={`#summary-${field}`}
                  onClick={(e) => {
                    e.preventDefault();
                    focusField(field);
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Field id="name" label="Name" autoComplete="name" error={errors.name} accessible />
      <Field id="email" label="Email address" autoComplete="email" error={errors.email} accessible />
      <div>
        <button type="submit" className="btn" data-testid="trigger">
          Submit
        </button>
      </div>
    </form>
  );
}

export function Broken() {
  const [errors, setErrors] = useState<Errors>({});
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(validate(e.currentTarget));
  };
  return (
    <form noValidate className="stack" onSubmit={onSubmit}>
      <Field id="name" label="Name" autoComplete="name" error={errors.name} />
      <Field id="email" label="Email address" autoComplete="email" error={errors.email} />
      <div>
        <button type="submit" className="btn" data-testid="trigger">
          Submit
        </button>
      </div>
    </form>
  );
}

function Field(props: { id: 'name' | 'email'; label: string; autoComplete: string; error?: string; accessible?: boolean }) {
  const { id, label, autoComplete, error, accessible } = props;
  const inputId = `summary-${id}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="stack-tight">
      <label htmlFor={inputId}>{label}</label>
      {error && (
        <p id={accessible ? errorId : undefined} className="error" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
      <input
        id={inputId}
        name={id}
        autoComplete={autoComplete}
        className={error ? 'input-error' : undefined}
        aria-invalid={accessible && error ? true : undefined}
        aria-describedby={accessible && error ? errorId : undefined}
        data-testid={id}
      />
    </div>
  );
}
