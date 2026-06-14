import { Navigate, Link } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import AppHeader from '../components/AppHeader';
import '../styles/Home.css';

export default function Home() {
  const user = getCurrentUser();

  // Route guard: not logged in -> back to /login (every protected page does this one-liner)
  if (!user) return <Navigate to="/login" replace />;

  const base = `/users/${user.username}`;
  const initial = (user.name || user.username).trim().charAt(0).toUpperCase();

  return (
    <>
      <AppHeader active="home" />

      <main className="home">
        <section className="home-hero card">
          <span className="avatar avatar-lg" aria-hidden="true">{initial}</span>
          <div className="home-hero-text">
            <p className="muted">Signed in as @{user.username}</p>
            <h1>Hello, {user.name}</h1>
            <p className="home-hero-sub">Welcome back — pick where you want to go.</p>
          </div>
        </section>

        <div className="home-tiles">
          <Link className="tile" to={`${base}/info`}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
            <span className="tile-title">Info</span>
            <span className="tile-desc">Your profile details</span>
          </Link>

          <Link className="tile" to={`${base}/todos`}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
            <span className="tile-title">Todos</span>
            <span className="tile-desc">Tasks to get done</span>
          </Link>

          <Link className="tile" to={`${base}/posts`}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="tile-title">Posts</span>
            <span className="tile-desc">Share and discuss</span>
          </Link>

          <Link className="tile" to={`${base}/albums`}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </span>
            <span className="tile-title">Albums</span>
            <span className="tile-desc">Your photos</span>
          </Link>

          <Link className="tile" to={`${base}/settings`}>
            <span className="tile-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <span className="tile-title">Settings</span>
            <span className="tile-desc">Profile &amp; password</span>
          </Link>

          {user.is_admin ? (
            <Link className="tile" to={`${base}/admin`}>
              <span className="tile-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <span className="tile-title">Admin</span>
              <span className="tile-desc">Manage users</span>
            </Link>
          ) : null}
        </div>
      </main>
    </>
  );
}
