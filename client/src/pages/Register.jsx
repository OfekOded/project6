/**
 * File: client/src/pages/Register.jsx
 * Purpose: /register page - form -> POST /register -> on success save user + navigate to /users/:username.
 * Owner: Partner B
 * Stage: C (שלב ג)
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { saveCurrentUser } from '../storage';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    // Client-side checks (the server validates again - never trust the client alone).
    if (!username || !password || !name) {
      setErrorMessage('Username, password and name are required.');
      return;
    }
    if (password !== passwordVerify) {
      setErrorMessage('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, email, phone }),
      });

      if (res.status === 409) {
        setErrorMessage('That username is already taken. Please choose another.');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || 'Registration failed. Please try again.');
        return;
      }

      const user = await res.json(); // the new user, WITHOUT a password
      saveCurrentUser(user);
      navigate(`/users/${user.username}`);
    } catch {
      setErrorMessage('Cannot reach the server. Is it running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="register-page">
      <form className="register-card card" onSubmit={handleSubmit}>
        <h1 className="register-title">Create your account</h1>

        <div className="form-field">
          <label htmlFor="reg-username">Username</label>
          <input id="reg-username" className="input" value={username}
                 onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>

        <div className="form-field">
          <label htmlFor="reg-name">Full name</label>
          <input id="reg-name" className="input" value={name}
                 onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>

        <div className="form-field">
          <label htmlFor="reg-password">Password</label>
          <input id="reg-password" className="input" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>

        <div className="form-field">
          <label htmlFor="reg-password2">Confirm password</label>
          <input id="reg-password2" className="input" type="password" value={passwordVerify}
                 onChange={(e) => setPasswordVerify(e.target.value)} autoComplete="new-password" />
        </div>

        <div className="form-field">
          <label htmlFor="reg-email">Email (optional)</label>
          <input id="reg-email" className="input" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>

        <div className="form-field">
          <label htmlFor="reg-phone">Phone (optional)</label>
          <input id="reg-phone" className="input" value={phone}
                 onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </div>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
