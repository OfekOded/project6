/**
 * File: client/src/pages/Info.jsx
 * Purpose: /users/:username/info - shows the active user's personal details (NEVER the password -
 *          the server never sends it anyway).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getJson } from '../apiClient';
import { getCurrentUser } from '../storage';
import '../styles/Home.css';

export default function Info() {
  const user = getCurrentUser();
  const userId = user?.id;

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!userId) return;

    async function loadInfo() {
      setLoading(true);
      setErrorMessage('');
      try {
        setInfo(await getJson(`/users/${userId}`));
      } catch {
        setErrorMessage('Could not load user info. Is the server running?');
      } finally {
        setLoading(false);
      }
    }

    loadInfo();
  }, [userId]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="info-page">
      <section className="info-card card">
        <Link className="back-link" to={`/users/${user.username}`}>Back</Link>
        <h1>Info</h1>

        {loading && <p className="muted">Loading info...</p>}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {!loading && info && (
          <dl className="info-list">
            <div>
              <dt>ID</dt>
              <dd>{info.id}</dd>
            </div>
            <div>
              <dt>Username</dt>
              <dd>{info.username}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{info.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{info.email || '-'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{info.phone || '-'}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
