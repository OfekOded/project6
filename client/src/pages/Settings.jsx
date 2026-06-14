import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { putJson } from '../apiClient';
import { getCurrentUser, saveCurrentUser } from '../storage';
import AppHeader from '../components/AppHeader';
import FormField from '../components/forms/FormField';
import '../styles/Settings.css';

const PASSWORD_MIN = 6;

export default function Settings() {
  const user = getCurrentUser();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [detailsMsg, setDetailsMsg] = useState('');
  const [detailsErr, setDetailsErr] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  async function saveDetails(e) {
    e.preventDefault();
    setDetailsMsg('');
    setDetailsErr('');
    if (!name.trim()) {
      setDetailsErr('Name cannot be empty.');
      return;
    }
    try {
      const updated = await putJson(`/users/${user.id}`, { userId: user.id, name, email, phone });
      saveCurrentUser({ ...user, name: updated.name, email: updated.email, phone: updated.phone });
      setDetailsMsg('Your details were saved.');
    } catch (err) {
      setDetailsErr(err.message || 'Could not save your details.');
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    if (newPassword.length < PASSWORD_MIN) {
      setPwErr(`New password must be at least ${PASSWORD_MIN} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwErr('The new passwords do not match.');
      return;
    }
    try {
      await putJson(`/users/${user.id}/password`, { userId: user.id, currentPassword, newPassword });
      setPwMsg('Your password was changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr(err.status === 401 ? 'Your current password is incorrect.' : (err.message || 'Could not change your password.'));
    }
  }

  return (
    <>
      <AppHeader active="settings" />
      <main className="page settings-page">
        <div className="page-head">
          <h1>Settings</h1>
          <p className="page-sub">Update your profile and your password.</p>
        </div>

        <form className="card settings-card" onSubmit={saveDetails}>
          <h2>Profile details</h2>
          <FormField id="set-name" label="Full name" value={name} onChange={setName} autoComplete="name" />
          <FormField id="set-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <FormField id="set-phone" label="Phone" value={phone} onChange={setPhone} autoComplete="tel" />
          {detailsErr && <p className="error-text">{detailsErr}</p>}
          {detailsMsg && <p className="success-text">{detailsMsg}</p>}
          <button type="submit" className="btn btn-primary">Save details</button>
        </form>

        <form className="card settings-card" onSubmit={changePassword}>
          <h2>Change password</h2>
          <FormField id="set-cur" label="Current password" type="password" value={currentPassword}
                     onChange={setCurrentPassword} autoComplete="current-password" />
          <FormField id="set-new" label="New password" type="password" value={newPassword}
                     onChange={setNewPassword} autoComplete="new-password" hint={`At least ${PASSWORD_MIN} characters.`} />
          <FormField id="set-confirm" label="Confirm new password" type="password" value={confirmPassword}
                     onChange={setConfirmPassword} autoComplete="new-password" />
          {pwErr && <p className="error-text">{pwErr}</p>}
          {pwMsg && <p className="success-text">{pwMsg}</p>}
          <button type="submit" className="btn btn-primary">Change password</button>
        </form>
      </main>
    </>
  );
}
