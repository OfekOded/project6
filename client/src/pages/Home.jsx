/**
 * File: client/src/pages/Home.jsx
 * Purpose: /users/:username - the app home after login. Buttons: Info / Todos / Posts / Logout.
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser } from '../storage';
import '../styles/Home.css';

export default function Home() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  // Route guard: not logged in -> back to /login (every protected page does this one-liner)
  if (!user) return <Navigate to="/login" replace />;

  function handleLogout() {
    clearCurrentUser();
    navigate('/login');
  }

  return (
    <div className="home-page">
      <section className="home-card card">
        <p className="muted">Signed in as @{user.username}</p>
        <h1>Hello, {user.name}</h1>

        <nav className="home-actions" aria-label="User pages">
          <Link className="btn btn-ghost" to={`/users/${user.username}/info`}>Info</Link>
          <Link className="btn btn-ghost" to={`/users/${user.username}/todos`}>Todos</Link>
          <Link className="btn btn-ghost" to={`/users/${user.username}/posts`}>Posts</Link>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </nav>
      </section>
    </div>
  );
}
