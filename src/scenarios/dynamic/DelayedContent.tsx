import { useEffect, useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const ITEMS = ['Introduction to screen readers', 'Writing good alt text', 'Testing with NVDA'];

function useInjected(delay: number) {
  const [ready, setReady] = useState(false);
  const later = useDelayedAction();
  useEffect(() => {
    later(() => setReady(true), delay);
  }, [later, delay]);
  return ready;
}

export function Accessible({ delay }: ScenarioProps) {
  const ready = useInjected(delay);
  return (
    <>
      <p>Your reading list is below.</p>
      <section aria-labelledby="rec-heading" aria-busy={!ready} data-testid="region">
        <h2 id="rec-heading">Recommended for you</h2>
        <div role="status" className="status" data-testid="status">
          {ready ? `${ITEMS.length} recommendations loaded` : 'Loading recommendations…'}
        </div>
        {ready && (
          <ul data-testid="injected">
            {ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const ready = useInjected(delay);
  return (
    <>
      <p>Your reading list is below.</p>
      {ready && (
        <div data-testid="injected">
          <div className="fake-heading">Recommended for you</div>
          {ITEMS.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      )}
    </>
  );
}
