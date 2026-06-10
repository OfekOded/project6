/**
 * File: client/src/pages/Login.jsx
 * Purpose: /login page - form -> POST /login -> save user in Local Storage -> navigate to /users/:username.
 *          Failed login: show message and STAY on /login (stage C requirement).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postJson } from '../apiClient';
import { saveCurrentUser } from '../storage';
import FormField from '../components/forms/FormField';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await postJson('/login', { username, password });
      saveCurrentUser(user);
      navigate(`/users/${user.username}`);
    } catch (err) {
      if (err.status) {
        setErrorMessage(err.status === 401 ? 'Wrong username or password.' : err.message);
        return;
      }
      setErrorMessage('Cannot reach the server. Is it running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card card" onSubmit={handleSubmit}>
        <h1 className="login-title">Log in</h1>

        <FormField id="login-username" label="Username" value={username}
                   onChange={setUsername} autoComplete="username" />

        <FormField id="login-password" label="Password" type="password" value={password}
                   onChange={setPassword} autoComplete="current-password" />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="muted">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
