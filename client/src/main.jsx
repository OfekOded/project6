/**
 * File: client/src/main.jsx
 * Purpose: React entry point - mounts <App /> inside BrowserRouter.
 * Owner: Partner B | SHARED INFRA - FROZEN after kickoff
 * Stage: C (שלב ג)
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
