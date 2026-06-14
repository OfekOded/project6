import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getJson, putJson } from '../apiClient';
import { getCurrentUser } from '../storage';
import AppHeader from '../components/AppHeader';
import '../styles/Admin.css';

export default function Admin() {
  const user = getCurrentUser();
  const userId = user?.id;
  const isAdmin = !!user?.is_admin;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      setUsers(await getJson(`/admin/users?adminId=${userId}`));
    } catch (err) {
      setError(err.status === 403 ? 'Admins only.' : 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId || !isAdmin) return;
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getJson(`/admin/users?adminId=${userId}`);
        if (active) setUsers(data);
      } catch (err) {
        if (active) setError(err.status === 403 ? 'Admins only.' : 'Could not load users.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [userId, isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to={`/users/${user.username}`} replace />;

  async function toggleBlock(target) {
    setError('');
    try {
      await putJson(`/admin/users/${target.id}/block`, { adminId: userId, blocked: target.blocked ? 0 : 1 });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Could not update the user.');
    }
  }

  return (
    <>
      <AppHeader active="admin" />
      <main className="page admin-page">
        <div className="page-head">
          <h1>Admin</h1>
          <p className="page-sub">Manage users and their access.</p>
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="muted">Loading users...</p>}

        <ul className="admin-list">
          {users.map((u) => (
            <li key={u.id} className="admin-row card">
              <span className="avatar avatar-sm" aria-hidden="true">
                {(u.name || u.username).trim().charAt(0).toUpperCase()}
              </span>
              <div className="admin-user">
                <span className="admin-name">
                  {u.name}
                  {u.is_admin ? <span className="badge">admin</span> : null}
                </span>
                <span className="muted">@{u.username}</span>
              </div>
              <span className={u.blocked ? 'badge badge-danger' : 'badge badge-success'}>
                {u.blocked ? 'blocked' : 'active'}
              </span>
              {u.id !== userId && (
                <button
                  type="button"
                  className={`btn btn-sm ${u.blocked ? 'btn-ghost' : 'btn-danger'}`}
                  onClick={() => toggleBlock(u)}
                >
                  {u.blocked ? 'Unblock' : 'Block'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
