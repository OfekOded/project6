/**
 * File: client/src/pages/Register.jsx
 * Purpose: /register page - form -> POST /register -> on success save user + navigate to /users/:username.
 * Owner: Partner B
 * Stage: C
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postJson } from '../apiClient';
import { saveCurrentUser } from '../storage';
import FormField from '../components/forms/FormField';
import '../styles/Register.css';

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
      const user = await postJson('/register', { username, password, name, email, phone });
      saveCurrentUser(user);
      navigate(`/users/${user.username}`);
    } catch (err) {
      if (err.status) {
        setErrorMessage(
          err.status === 409 ? 'That username is already taken. Please choose another.' : err.message
        );
        return;
      }
      setErrorMessage('Cannot reach the server. Is it running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="register-page">
      <form className="register-card card" onSubmit={handleSubmit}>
        <h1 className="register-title">Create your account</h1>

        <FormField id="reg-username" label="Username" value={username}
                   onChange={setUsername} autoComplete="username" />
        <FormField id="reg-name" label="Full name" value={name}
                   onChange={setName} autoComplete="name" />
        <FormField id="reg-password" label="Password" type="password" value={password}
                   onChange={setPassword} autoComplete="new-password" />
        <FormField id="reg-password2" label="Confirm password" type="password" value={passwordVerify}
                   onChange={setPasswordVerify} autoComplete="new-password" />
        <FormField id="reg-email" label="Email (optional)" type="email" value={email}
                   onChange={setEmail} autoComplete="email" />
        <FormField id="reg-phone" label="Phone (optional)" value={phone}
                   onChange={setPhone} autoComplete="tel" />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create account'}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
