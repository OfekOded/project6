/**
 * File: client/src/pages/Login.jsx
 * Purpose: /login page - form -> POST /login -> save user in Local Storage -> navigate to /users/:username.
 *          Failed login: show message and STAY on /login (stage C requirement).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { saveCurrentUser } from '../storage';
import './Login.css';

export default function Login() {
  // TODO (A): useState for username, password, errorMessage

  async function handleSubmit(e) {
    // TODO (A):
    // e.preventDefault()
    // const res = await fetch(`${API_URL}/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    // if (!res.ok) -> setErrorMessage(...) and STAY here (401 from server)
    // else -> const user = await res.json(); saveCurrentUser(user);
    //         navigate(`/users/${user.username}`)
  }

  return (
    <div className="login-page">
      {/* TODO (A): <form onSubmit={handleSubmit}> with username + password inputs,
          submit button, error message area, and <Link to="/register"> for new users */}
    </div>
  );
}
