import { KeyboardEvent, useRef, useState } from 'react';

const TABS = [
  { id: 'profile', label: 'Profile', body: 'Your name, photo and bio.' },
  { id: 'security', label: 'Security', body: 'Password and two-step verification.' },
  { id: 'billing', label: 'Billing', body: 'Payment methods and invoices.' },
];

export function Accessible() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setSelected(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = TABS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]);
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label="Account sections" className="tablist" onKeyDown={onKeyDown}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={selected === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={selected === i ? 0 : -1}
            className="tab"
            data-testid={`tab-${t.id}`}
            onClick={() => select(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          tabIndex={0}
          className="tabpanel"
          data-testid={`panel-${t.id}`}
          hidden={selected !== i}
        >
          <p>{t.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Broken() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="tabs">
      <div className="tablist">
        {TABS.map((t, i) => (
          // role="tab" outside a tablist, not focusable, no selected state.
          <div
            key={t.id}
            role="tab"
            className="tab"
            data-active={selected === i}
            data-testid={`tab-${t.id}`}
            onClick={() => setSelected(i)}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div className="tabpanel" data-testid={`panel-${TABS[selected].id}`}>
        <p>{TABS[selected].body}</p>
      </div>
    </div>
  );
}
