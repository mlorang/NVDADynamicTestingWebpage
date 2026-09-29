import { useState } from 'react';

interface Employee {
  name: string;
  department: string;
  start: string;
}

type Column = keyof Employee;
type Direction = 'ascending' | 'descending';

const EMPLOYEES: Employee[] = [
  { name: 'Grace Hopper', department: 'Engineering', start: '2019-03-11' },
  { name: 'Alan Turing', department: 'Research', start: '2021-07-01' },
  { name: 'Ada Lovelace', department: 'Engineering', start: '2018-01-15' },
  { name: 'Katherine Johnson', department: 'Operations', start: '2020-10-05' },
];

const COLUMNS: { key: Column; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'start', label: 'Start date' },
];

function useSort() {
  const [sort, setSort] = useState<{ column: Column; direction: Direction } | null>(null);
  const toggle = (column: Column) =>
    setSort((prev) => ({
      column,
      direction: prev?.column === column && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  const rows = sort
    ? [...EMPLOYEES].sort((a, b) => {
        const cmp = a[sort.column].localeCompare(b[sort.column]);
        return sort.direction === 'ascending' ? cmp : -cmp;
      })
    : EMPLOYEES;
  return { sort, toggle, rows };
}

function Arrow({ direction }: { direction?: Direction }) {
  return <span aria-hidden="true">{direction === 'ascending' ? ' ▲' : direction === 'descending' ? ' ▼' : ' ↕'}</span>;
}

function Body({ rows }: { rows: Employee[] }) {
  return (
    <tbody>
      {rows.map((r) => (
        <tr key={r.name}>
          <td>{r.name}</td>
          <td>{r.department}</td>
          <td>{r.start}</td>
        </tr>
      ))}
    </tbody>
  );
}

export function Accessible() {
  const { sort, toggle, rows } = useSort();
  const label = (c: Column) => COLUMNS.find((col) => col.key === c)!.label;
  return (
    <>
      <div className="table-scroll">
        <table className="data-table">
          <caption>Employees</caption>
          <thead>
            <tr>
              {COLUMNS.map((c) => {
                const direction = sort?.column === c.key ? sort.direction : undefined;
                return (
                  <th key={c.key} scope="col" aria-sort={direction}>
                    <button type="button" className="sort-btn" data-testid={`sort-${c.key}`} onClick={() => toggle(c.key)}>
                      {c.label}
                      <Arrow direction={direction} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <Body rows={rows} />
        </table>
      </div>
      <div role="status" className="status" data-testid="status">
        {sort && `Sorted by ${label(sort.column)}, ${sort.direction}`}
      </div>
    </>
  );
}

export function Broken() {
  const { sort, toggle, rows } = useSort();
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.key} className="sortable" data-testid={`sort-${c.key}`} onClick={() => toggle(c.key)}>
                {c.label}
                <Arrow direction={sort?.column === c.key ? sort.direction : undefined} />
              </th>
            ))}
          </tr>
        </thead>
        <Body rows={rows} />
      </table>
    </div>
  );
}
