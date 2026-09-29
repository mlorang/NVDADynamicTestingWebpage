import { useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const ERROR = 'Error: Could not save changes. Check your connection and try again.';

function useFailingSave(delay: number) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const later = useDelayedAction();
  const save = () => {
    setError('');
    setSaving(true);
    later(() => {
      setSaving(false);
      setError(ERROR);
    }, delay);
  };
  return { save, saving, error };
}

export function Accessible({ delay }: ScenarioProps) {
  const { save, saving, error } = useFailingSave(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      <div role="alert" className="alert-container" data-testid="alert">
        {error && <p className="error-banner" data-testid="error-text">{error}</p>}
      </div>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const { save, saving, error } = useFailingSave(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      <div aria-live="off" className="alert-container" data-testid="alert">
        {error && <p className="error-banner" data-testid="error-text">{error}</p>}
      </div>
    </>
  );
}
