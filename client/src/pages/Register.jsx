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
  // TODO (B): useState for username, password, passwordVerify, name, email, phone, errorMessage

  async function handleSubmit(e) {
    // TODO (B):
    // - client-side checks (password === passwordVerify, required fields) -> error message
    // - fetch POST `${API_URL}/register` with the JSON body
    // - 409 -> "username taken" message; 400 -> validation message
    // - 201 -> saveCurrentUser(newUser); navigate(`/users/${newUser.username}`)
  }

  return (
    <div className="register-page">
      {/* TODO (B): form with username / password / verify / name / email / phone,
          submit button, error area, <Link to="/login"> for existing users */}
    </div>
  );
}
