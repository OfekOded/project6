/**
 * File: client/src/pages/Home.jsx
 * Purpose: /users/:username - the app home after login. Buttons: Info / Todos / Posts / Logout.
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useNavigate, Navigate, Link, useParams } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser } from '../storage';
import './Home.css';

export default function Home() {
  const user = getCurrentUser();
  // Route guard: not logged in -> back to /login (every protected page does this one-liner)
  if (!user) return <Navigate to="/login" replace />;

  function handleLogout() {
    // TODO (A): clearCurrentUser(); navigate('/login')   (stage C: delete from LS + back to login)
  }

  return (
    <div className="home-page">
      {/* TODO (A): greeting with user.name +
          <Link to={`/users/${user.username}/info`}>Info</Link>
          <Link to={`/users/${user.username}/todos`}>Todos</Link>
          <Link to={`/users/${user.username}/posts`}>Posts</Link>
          <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}
