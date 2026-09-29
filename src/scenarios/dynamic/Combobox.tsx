import { KeyboardEvent, useState } from 'react';

const FRUITS = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Grape',
  'Grapefruit', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum',
];

function useFilter() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const matches = query.trim()
    ? FRUITS.filter((f) => f.toLowerCase().includes(query.trim().toLowerCase()))
    : [];
  return { query, setQuery, open: open && matches.length > 0, setOpen, matches };
}

export function Accessible() {
  const { query, setQuery, open, setOpen, matches } = useFilter();
  const [active, setActive] = useState(-1);

  const choose = (value: string) => {
    setQuery(value);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % Math.max(matches.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === 'Enter' && open && active >= 0) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  const count = matches.length;
  const statusText = query.trim()
    ? `${count} ${count === 1 ? 'result' : 'results'} available.`
    : '';

  return (
    <div className="combobox">
      <label htmlFor="fruit">Favorite fruit</label>
      <input
        id="fruit"
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="fruit-listbox"
        aria-activedescendant={open && active >= 0 ? `fruit-option-${active}` : undefined}
        data-testid="combobox"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
      />
      <ul role="listbox" id="fruit-listbox" aria-label="Fruits" className="listbox" data-testid="listbox" hidden={!open}>
        {open &&
          matches.map((f, i) => (
            <li
              key={f}
              id={`fruit-option-${i}`}
              role="option"
              aria-selected={i === active}
              className="option"
              data-testid={`option-${f.toLowerCase()}`}
              // mousedown fires before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault();
                choose(f);
              }}
            >
              {f}
            </li>
          ))}
      </ul>
      <div role="status" className="visually-hidden" data-testid="status">
        {statusText}
      </div>
    </div>
  );
}

export function Broken() {
  const { query, setQuery, open, setOpen, matches } = useFilter();
  return (
    <div className="combobox">
      <label htmlFor="fruit">Favorite fruit</label>
      <input
        id="fruit"
        type="text"
        autoComplete="off"
        data-testid="combobox"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && (
        <ul className="listbox" data-testid="listbox">
          {matches.map((f) => (
            // role="option" outside of a listbox, not reachable by keyboard.
            <li
              key={f}
              role="option"
              aria-selected={false}
              className="option"
              data-testid={`option-${f.toLowerCase()}`}
              onClick={() => {
                setQuery(f);
                setOpen(false);
              }}
            >
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
