/**
 * File: client/src/pages/Info.jsx
 * Purpose: /users/:username/info - shows the active user's personal details (NEVER the password -
 *          the server never sends it anyway).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { getCurrentUser } from '../storage';
import './Home.css';

export default function Info() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  // TODO (A): useEffect -> fetch(`${API_URL}/users/${user.id}`) to show FRESH data from the DB
  // (could also render straight from LS, but a GET demonstrates the API - better for grading).

  return (
    <div className="info-page">
      {/* TODO (A): render id / username / name / email / phone + <Link> back to home */}
    </div>
  );
}
