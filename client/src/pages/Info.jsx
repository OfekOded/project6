import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getJson } from '../apiClient';
import { getCurrentUser } from '../storage';
import AppHeader from '../components/AppHeader';
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
    <>
      <AppHeader active="info" />
      <main className="info-page">
        <div className="page-head">
          <h1>Info</h1>
          <p className="page-sub">Your account details, straight from the database.</p>
        </div>

        <section className="info-card card">
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
      </main>
    </>
  );
}
