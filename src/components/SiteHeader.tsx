import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav aria-label="Site">
        <Link to="/" className="site-title">
          NVDA dynamic test page
        </Link>
      </nav>
    </header>
  );
}
