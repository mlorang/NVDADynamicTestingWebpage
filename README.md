# NVDA dynamic testing webpage

A set of dynamic UI components for testing screen-reader and accessibility tooling. The tests live in other repositories, such as [nvda-dynamic-testing-framework](https://github.com/mlorang/nvda-dynamic-testing-framework) and Playwright + axe-core suites. This repo only hosts the page they test against.

Every scenario has two variants:

- **accessible**: a correct implementation. It has zero axe-core violations, including in its dynamic states.
- **broken**: the same UI with a deliberate, realistic accessibility flaw.

Live site: https://mlorang.github.io/nvda-dynamic-testing-webpage/

## URL contract

Scenarios use hash routing, which is needed for GitHub Pages:

```
<base>/#/<scenario path>?variant=accessible|broken&delay=<ms>
```

| Param     | Values                  | Default                                   |
|-----------|-------------------------|-------------------------------------------|
| `variant` | `accessible`, `broken`  | `accessible`                              |
| `delay`   | milliseconds, `0`+      | per scenario (`defaultDelay` in manifest) |

`delay` controls when async updates happen, such as status messages, loading, and injected content. Use `delay=0` for fast deterministic runs. Use a large value to hold a transient state, such as the loading spinner, while you audit it.

Every scenario page also has the following:

- `data-testid="scenario-root"`. It carries the `data-scenario`, `data-variant` and `data-delay` attributes.
- A **Reset scenario** button (`data-testid="reset"`). It remounts the component and cancels any pending timers.
- A variant toggle link (`data-testid="toggle-variant"`).
- `document.title` in the form `<Scenario title> (<variant>) – NVDA test page`.

## Manifest: `scenarios.json`

`<base>/scenarios.json` lists every scenario with everything a test runner needs:

- **`urls.accessible` / `urls.broken`**: hash URLs, relative to the base URL.
- **`setup`**: steps that put the page into its dynamic state before you audit. Each step targets a `data-testid` and is one of `click`, `fill` (with `value`), `press` (with `value`, a key name), or `waitFor`.
- **`expected.accessible`**: key phrases a screen reader should announce.
- **`axe.brokenRules`**: axe-core rule ids the broken variant must violate after setup.
- **`axe.nvdaOnly`**: `true` when the flaw is invisible to axe, such as a missing live region or missing focus management. Only a screen-reader test can catch these.

The manifest is generated from [src/scenarios/registry.data.ts](src/scenarios/registry.data.ts) by `npm run manifest`. It runs automatically before `start` and `build`.

**Suggested axe usage in a Playwright repo:**
1. For each scenario and variant, open the URL and run the `setup` steps.
2. Run `AxeBuilder.analyze()`.
3. For the accessible variant, expect `violations` to equal `[]`.
4. For the broken variant, expect the violation ids to include every entry in `axe.brokenRules`.

Some rules are axe `best-practice` rules (for example `aria-dialog-name`), so don't narrow the scan to WCAG tags only. The broken combobox also triggers `list`.

**Python consumers:** model the manifest with a `TypedDict` or dataclass and type-check it with Pyright.

## Scenarios

| Category | Scenario | Broken variant flaw | axe detects |
|---|---|---|---|
| Live regions | Polite status (`/live/polite`) | No live region | NVDA only |
| Live regions | Error alert (`/live/alert`) | `aria-live="off"` | NVDA only |
| Live regions | Toast (`/live/toast`) | Live region mounted with its content | NVDA only |
| Live regions | Loading (`/live/loading`) | Unlabeled spinner, silent completion | `svg-img-alt` |
| Disclosure | Accordion (`/disclosure/accordion`) | Clickable divs, no state | NVDA only |
| Disclosure | Modal dialog (`/disclosure/dialog`) | No name, no focus management | `aria-dialog-name` |
| Disclosure | Tabs (`/disclosure/tabs`) | No tablist, no keyboard | `aria-required-parent` |
| Disclosure | Menu button (`/disclosure/menu`) | Unnamed icon button, plain list | `button-name` |
| Forms | Inline validation (`/forms/inline-validation`) | Color-only error | NVDA only |
| Forms | Error summary (`/forms/error-summary`) | Silent errors, no focus move | NVDA only |
| Forms | Labels (`/forms/labels`) | Unassociated labels | `label` |
| Forms | Confirmation (`/forms/success`) | Content swap, focus lost | NVDA only |
| Dynamic | Combobox (`/dynamic/combobox`) | No combobox/listbox semantics | `aria-required-parent`, `list` |
| Dynamic | Load more (`/dynamic/load-more`) | Silent append, focus lost | NVDA only |
| Dynamic | Sortable table (`/dynamic/sortable-table`) | No `aria-sort`, no buttons | NVDA only |
| Dynamic | Delayed content (`/dynamic/delayed-content`) | Silent injection, fake heading | NVDA only |

## Adding a scenario

1. Create `src/scenarios/<category>/<Name>.tsx`. It must export `Accessible` and `Broken` components, and each takes a `{ delay }` prop. Use `useDelayedAction` for timers so resets cancel them.
2. Add its metadata to `SCENARIOS` in `src/scenarios/registry.data.ts`.
3. Map its id to the module in `src/scenarios/registry.ts`.

## Development

```
npm install
npm start        # dev server at http://localhost:3000
npm test         # Jest unit tests
npm run build    # production build in build/ (includes scenarios.json)
```

Built with Create React App, TypeScript and React Router (hash router). Pushes to `main` deploy to GitHub Pages through [.github/workflows/main.yml](.github/workflows/main.yml).
