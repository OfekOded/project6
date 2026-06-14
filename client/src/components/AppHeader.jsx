import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser } from '../storage';
import '../styles/AppHeader.css';

export default function AppHeader({ active }) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  if (!user) return null;

  const base = `/users/${user.username}`;
  const initial = (user.name || user.username).trim().charAt(0).toUpperCase();

  function handleLogout() {
    clearCurrentUser();
    navigate('/login');
  }

  return (
    <header className="app-bar">
      <div className="app-bar-inner">
        <Link to={base} className="app-brand" aria-label="Home">
          <span className="app-brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3" />
            </svg>
          </span>
          <span className="app-brand-name">DevSpace</span>
        </Link>

        <nav className="app-nav" aria-label="Primary">
          <Link className={`app-nav-link ${active === 'info' ? 'is-active' : ''}`} to={`${base}/info`}>Info</Link>
          <Link className={`app-nav-link ${active === 'todos' ? 'is-active' : ''}`} to={`${base}/todos`}>Todos</Link>
          <Link className={`app-nav-link ${active === 'posts' ? 'is-active' : ''}`} to={`${base}/posts`}>Posts</Link>
          <Link className={`app-nav-link ${active === 'albums' ? 'is-active' : ''}`} to={`${base}/albums`}>Albums</Link>
          <Link className={`app-nav-link ${active === 'settings' ? 'is-active' : ''}`} to={`${base}/settings`}>Settings</Link>
          {user.is_admin ? (
            <Link className={`app-nav-link ${active === 'admin' ? 'is-active' : ''}`} to={`${base}/admin`}>Admin</Link>
          ) : null}
        </nav>

        <div className="app-user">
          <span className="avatar avatar-sm" aria-hidden="true">{initial}</span>
          <span className="app-user-name">{user.name}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
