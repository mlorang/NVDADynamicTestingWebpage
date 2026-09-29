import { FormEvent, useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const MESSAGE = 'Thanks! Your feedback was submitted.';

function FeedbackFields({ submitting }: { submitting: boolean }) {
  return (
    <>
      <label htmlFor="feedback">Your feedback</label>
      <textarea id="feedback" name="feedback" rows={3} data-testid="feedback" />
      <div>
        <button type="submit" className="btn" data-testid="trigger">
          {submitting ? 'Sending…' : 'Send feedback'}
        </button>
      </div>
    </>
  );
}

export function Accessible({ delay }: ScenarioProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const later = useDelayedAction();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setMessage('');
    setSubmitting(true);
    later(() => {
      setSubmitting(false);
      form.reset();
      setMessage(MESSAGE);
    }, delay);
  };

  return (
    <>
      <form className="stack" onSubmit={onSubmit}>
        <FeedbackFields submitting={submitting} />
      </form>
      <div role="status" className="status" data-testid="status">
        {message && (
          <p className="success" data-testid="success">
            {message}
          </p>
        )}
      </div>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const later = useDelayedAction();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    later(() => setDone(true), delay);
  };

  // The focused submit button is removed from the DOM; focus falls to <body>.
  if (done) {
    return (
      <p className="success" data-testid="success">
        {MESSAGE}
      </p>
    );
  }
  return (
    <form className="stack" onSubmit={onSubmit}>
      <FeedbackFields submitting={submitting} />
    </form>
  );
}
