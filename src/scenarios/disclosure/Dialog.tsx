import { KeyboardEvent, useEffect, useRef, useState } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function SettingsForm({ onClose }: { onClose: () => void }) {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <label htmlFor="display-name">Display name</label>
      <input id="display-name" data-testid="display-name" defaultValue="Ada" />
      <div className="row">
        <button type="submit" className="btn" data-testid="save">
          Save
        </button>
        <button type="button" className="btn btn-secondary" data-testid="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function Accessible() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLElement>('input')?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button type="button" className="btn" ref={openerRef} data-testid="trigger" onClick={() => setOpen(true)}>
        Open profile settings
      </button>
      {open && (
        <div className="backdrop">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-desc"
            className="dialog"
            data-testid="dialog"
            onKeyDown={onKeyDown}
          >
            <h2 id="dialog-title">Profile settings</h2>
            <p id="dialog-desc">Change how your name appears to others.</p>
            <SettingsForm onClose={close} />
          </div>
        </div>
      )}
    </>
  );
}

export function Broken() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={() => setOpen(true)}>
        Open profile settings
      </button>
      {open && (
        <div className="backdrop">
          {/* No accessible name, no aria-modal, focus is never moved or trapped. */}
          <div role="dialog" className="dialog" data-testid="dialog">
            <div className="dialog-title-text">Profile settings</div>
            <p>Change how your name appears to others.</p>
            <SettingsForm onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
