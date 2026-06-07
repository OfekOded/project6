/**
 * File: client/src/App.jsx
 * Purpose: route table only - one <Route> per page. Informative URLs (stage C requirement),
 *          e.g. /users/shlomo/posts.
 * Owner: Partner B | SHARED INFRA - all routes were agreed at kickoff, file is FROZEN.
 *        (Partner A never edits this file; a new route = message Partner B.)
 * Stage: C (שלב ג)
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';       // Partner A
import Register from './pages/Register'; // Partner B
import Home from './pages/Home';         // Partner A
import Info from './pages/Info';         // Partner A
import Todos from './pages/Todos';       // Partner A
import Posts from './pages/Posts';       // Partner B

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/:username" element={<Home />} />
      <Route path="/users/:username/info" element={<Info />} />
      <Route path="/users/:username/todos" element={<Todos />} />
      <Route path="/users/:username/posts" element={<Posts />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
