import { SVGProps, useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const RESULTS = ['Screen reader basics', 'ARIA live regions', 'Focus management', 'Accessible forms', 'Keyboard navigation'];

type Phase = 'idle' | 'loading' | 'done';

function useResults(delay: number) {
  const [phase, setPhase] = useState<Phase>('idle');
  const later = useDelayedAction();
  const load = () => {
    setPhase('loading');
    later(() => setPhase('done'), delay);
  };
  return { phase, load };
}

function Spinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="spinner" viewBox="0 0 50 50" width="32" height="32" data-testid="spinner" {...props}>
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </svg>
  );
}

function ResultList() {
  return (
    <ul data-testid="results">
      {RESULTS.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}

export function Accessible({ delay }: ScenarioProps) {
  const { phase, load } = useResults(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={load}>
        Load results
      </button>
      <section aria-labelledby="results-heading" aria-busy={phase === 'loading'}>
        <h2 id="results-heading">Results</h2>
        <div role="status" className="status" data-testid="status">
          {phase === 'loading' && 'Loading results…'}
          {phase === 'done' && `Loaded ${RESULTS.length} results`}
        </div>
        {phase === 'loading' && <Spinner aria-hidden="true" />}
        {phase === 'done' && <ResultList />}
      </section>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const { phase, load } = useResults(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={load}>
        Load results
      </button>
      <section>
        <h2>Results</h2>
        {/* role="img" with no accessible name */}
        {phase === 'loading' && <Spinner role="img" />}
        {phase === 'done' && <ResultList />}
      </section>
    </>
  );
}
