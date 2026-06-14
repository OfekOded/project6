import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postJson } from '../apiClient';
import { saveCurrentUser } from '../storage';
import FormField from '../components/forms/FormField';
import '../styles/Register.css';

// Keep this in sync with the server (register.routes.js PASSWORD_MIN).
const PASSWORD_MIN = 6;

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
      setErrorMessage('Username, full name and password are required.');
      return;
    }
    if (password.length < PASSWORD_MIN) {
      setErrorMessage(`Password must be at least ${PASSWORD_MIN} characters long.`);
      return;
    }
    if (password !== passwordVerify) {
      setErrorMessage('The two passwords do not match. Please type the same one twice.');
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
        <div className="auth-brand">
          <span className="auth-logo" aria-hidden="true">
            {/* user-plus icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          </span>
          <h1 className="register-title">Create your account</h1>
          <p className="auth-subtitle">It only takes a moment. Fields marked optional can be left blank.</p>
        </div>

        <FormField id="reg-username" label="Username" value={username}
                   onChange={setUsername} autoComplete="username"
                   hint="This is the name you will log in with. It must be unique." />
        <FormField id="reg-name" label="Full name" value={name}
                   onChange={setName} autoComplete="name"
                   hint="Shown on your profile and next to your posts." />
        <FormField id="reg-password" label="Password" type="password" value={password}
                   onChange={setPassword} autoComplete="new-password"
                   hint={`At least ${PASSWORD_MIN} characters. Use the eye button to check it.`} />
        <FormField id="reg-password2" label="Confirm password" type="password" value={passwordVerify}
                   onChange={setPasswordVerify} autoComplete="new-password"
                   hint="Type the same password again to avoid typos." />
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
