import { useEffect, useRef, useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const TOTAL = 15;
const PAGE = 5;

function useArticles(delay: number) {
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const later = useDelayedAction();
  const loadMore = () => {
    setLoading(true);
    later(() => {
      setShown((n) => Math.min(n + PAGE, TOTAL));
      setLoading(false);
    }, delay);
  };
  return { shown, loading, loadMore };
}

export function Accessible({ delay }: ScenarioProps) {
  const { shown, loading, loadMore } = useArticles(delay);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const firstNew = useRef<number | null>(null);

  useEffect(() => {
    if (firstNew.current !== null && shown > firstNew.current) {
      itemRefs.current[firstNew.current]?.focus();
      firstNew.current = null;
    }
  }, [shown]);

  return (
    <section aria-labelledby="articles-heading">
      <h2 id="articles-heading">Articles</h2>
      <ul className="article-list">
        {Array.from({ length: shown }, (_, i) => (
          <li
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            tabIndex={-1}
            data-testid={`item-${i + 1}`}
          >
            Article {i + 1}
          </li>
        ))}
      </ul>
      <div role="status" className="status" data-testid="status">
        {loading ? 'Loading more articles…' : `Showing ${shown} of ${TOTAL} articles`}
      </div>
      {shown < TOTAL && (
        <button
          type="button"
          className="btn"
          data-testid="trigger"
          onClick={() => {
            firstNew.current = shown;
            loadMore();
          }}
        >
          Load more articles
        </button>
      )}
    </section>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const { shown, loadMore } = useArticles(delay);
  return (
    <section>
      <h2>Articles</h2>
      <ul className="article-list">
        {Array.from({ length: shown }, (_, i) => (
          <li key={i} data-testid={`item-${i + 1}`}>
            Article {i + 1}
          </li>
        ))}
      </ul>
      {shown < TOTAL && (
        <button type="button" className="btn" data-testid="trigger" onClick={loadMore}>
          Load more articles
        </button>
      )}
    </section>
  );
}
