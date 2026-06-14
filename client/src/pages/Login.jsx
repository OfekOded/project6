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
      setErrorMessage('Please enter both your username and password.');
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
        <div className="auth-brand">
          <span className="auth-logo" aria-hidden="true">
            {/* lock icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <h1 className="login-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in with your username and password to continue.</p>
        </div>

        <FormField id="login-username" label="Username" value={username}
                   onChange={setUsername} autoComplete="username"
                   hint="The username you chose when you registered." />

        <FormField id="login-password" label="Password" type="password" value={password}
                   onChange={setPassword} autoComplete="current-password"
                   hint="Use the eye button to check what you typed." />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
