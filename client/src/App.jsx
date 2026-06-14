import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Info from './pages/Info';
import Todos from './pages/Todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

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
      <Route path="/users/:username/albums" element={<Albums />} />
      <Route path="/users/:username/settings" element={<Settings />} />
      <Route path="/users/:username/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
