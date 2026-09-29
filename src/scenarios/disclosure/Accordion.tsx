import { useState } from 'react';

const SECTIONS = [
  { q: 'What is NVDA?', a: 'NVDA (NonVisual Desktop Access) is a free, open-source screen reader for Windows.' },
  { q: 'Which browsers does NVDA support?', a: 'NVDA works with Chrome, Edge and Firefox.' },
  { q: 'How do I stop speech?', a: 'Press the Control key to silence NVDA immediately.' },
];

function useOpenSet() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return { open, toggle };
}

export function Accessible() {
  const { open, toggle } = useOpenSet();
  return (
    <div className="accordion">
      {SECTIONS.map((s, i) => {
        const expanded = open.has(i);
        return (
          <div key={s.q} className="accordion-item">
            <h2 className="accordion-heading">
              <button
                type="button"
                id={`acc-header-${i + 1}`}
                className="accordion-header"
                aria-expanded={expanded}
                aria-controls={`acc-panel-${i + 1}`}
                data-testid={i === 0 ? 'trigger' : `accordion-header-${i + 1}`}
                onClick={() => toggle(i)}
              >
                {s.q}
              </button>
            </h2>
            <div
              id={`acc-panel-${i + 1}`}
              role="region"
              aria-labelledby={`acc-header-${i + 1}`}
              className="accordion-panel"
              data-testid={`accordion-panel-${i + 1}`}
              hidden={!expanded}
            >
              <p>{s.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Broken() {
  const { open, toggle } = useOpenSet();
  return (
    <div className="accordion">
      {SECTIONS.map((s, i) => (
        <div key={s.q} className="accordion-item">
          <div
            className="accordion-header"
            data-testid={i === 0 ? 'trigger' : `accordion-header-${i + 1}`}
            onClick={() => toggle(i)}
          >
            {s.q}
          </div>
          <div
            className="accordion-panel"
            data-testid={`accordion-panel-${i + 1}`}
            style={{ display: open.has(i) ? 'block' : 'none' }}
          >
            <p>{s.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
