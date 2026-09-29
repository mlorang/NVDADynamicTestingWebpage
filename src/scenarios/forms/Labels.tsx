export function Accessible() {
  return (
    <form className="stack" onSubmit={(e) => e.preventDefault()}>
      <div className="stack-tight">
        <label htmlFor="full-name">
          Full name <span aria-hidden="true">*</span>
        </label>
        <p id="full-name-hint" className="hint">
          As shown on your ID
        </p>
        <input id="full-name" required autoComplete="name" aria-describedby="full-name-hint" data-testid="full-name" />
      </div>
      <div className="stack-tight">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" type="tel" autoComplete="tel" data-testid="phone" />
      </div>
      <p className="hint">
        Fields marked <span aria-hidden="true">*</span>
        <span className="visually-hidden">with an asterisk</span> are required.
      </p>
    </form>
  );
}

export function Broken() {
  return (
    <form className="stack" onSubmit={(e) => e.preventDefault()}>
      <div className="stack-tight">
        {/* Visual label text that is not associated with the input. */}
        <div className="fake-label">Full name *</div>
        <div className="hint">As shown on your ID</div>
        <input data-testid="full-name" />
      </div>
      <div className="stack-tight">
        <div className="fake-label">Phone (optional)</div>
        <input type="tel" data-testid="phone" />
      </div>
      <p className="hint">Fields marked * are required.</p>
    </form>
  );
}
