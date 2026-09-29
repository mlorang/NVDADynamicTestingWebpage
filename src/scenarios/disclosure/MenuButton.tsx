import { KeyboardEvent, useEffect, useRef, useState } from 'react';

const ACTIONS = ['Duplicate', 'Rename', 'Archive', 'Delete'];

function DotsIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="3" cy="8" r="1.6" />
      <circle cx="8" cy="8" r="1.6" />
      <circle cx="13" cy="8" r="1.6" />
    </svg>
  );
}

export function Accessible() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  const openMenu = (index: number) => {
    setActive(index);
    setOpen(true);
  };

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  const choose = (action: string) => {
    setStatus(`${action} selected`);
    close();
  };

  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu(ACTIONS.length - 1);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const last = ACTIONS.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(ACTIONS[active]);
    }
  };

  return (
    <div className="menu-wrapper">
      <button
        ref={buttonRef}
        type="button"
        id="actions-button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="actions-menu"
        data-testid="trigger"
        onClick={() => (open ? close() : openMenu(0))}
        onKeyDown={onButtonKeyDown}
      >
        Actions <DotsIcon />
      </button>
      <ul
        role="menu"
        id="actions-menu"
        aria-labelledby="actions-button"
        className="menu"
        data-testid="menu"
        hidden={!open}
        onKeyDown={onMenuKeyDown}
      >
        {ACTIONS.map((a, i) => (
          <li
            key={a}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            role="menuitem"
            tabIndex={-1}
            className="menu-item"
            data-testid={`menuitem-${a.toLowerCase()}`}
            onClick={() => choose(a)}
          >
            {a}
          </li>
        ))}
      </ul>
      <div role="status" className="status" data-testid="status">
        {status}
      </div>
    </div>
  );
}

export function Broken() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  return (
    <div className="menu-wrapper">
      {/* Icon-only button with no accessible name or popup state. */}
      <button type="button" className="btn icon-btn" data-testid="trigger" onClick={() => setOpen(!open)}>
        <DotsIcon />
      </button>
      {open && (
        <ul className="menu" data-testid="menu">
          {ACTIONS.map((a) => (
            <li
              key={a}
              className="menu-item"
              data-testid={`menuitem-${a.toLowerCase()}`}
              onClick={() => {
                setStatus(`${a} selected`);
                setOpen(false);
              }}
            >
              {a}
            </li>
          ))}
        </ul>
      )}
      <div className="status" data-testid="status">
        {status}
      </div>
    </div>
  );
}
