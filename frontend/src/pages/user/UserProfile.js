import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await API.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSavingPw(false); }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.avatarBox}>
        <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <div className={styles.name}>{user?.name}</div>
          <div className={styles.email}>{user?.email}</div>
          <span className={styles.roleBadge}>Customer</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Personal Information</h2>
        <form onSubmit={saveProfile} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" />
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input value={user?.email} disabled className={styles.disabled} />
            </div>
            <div className={styles.field}>
              <label>Account Role</label>
              <input value="Customer" disabled className={styles.disabled} />
            </div>
          </div>
          <button type="submit" className={styles.btn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Change Password</h2>
        <form onSubmit={changePassword} className={styles.form}>
          <div className={styles.field}>
            <label>Current Password</label>
            <input type="password" value={pwForm.currentPassword}
              onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>New Password</label>
              <input type="password" value={pwForm.newPassword}
                onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirm}
                onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
            </div>
          </div>
          <button type="submit" className={styles.btn} disabled={savingPw}>
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
