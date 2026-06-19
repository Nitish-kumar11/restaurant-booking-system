import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './AdminUsers.module.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.users);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id) => {
    try {
      await API.put(`/admin/users/${id}/toggle`);
      toast.success('User status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>{users.length} registered customers</p>
        </div>
        <input
          className={styles.search}
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className={styles.loading}>Loading customers...</p>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No customers found.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Joined</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td className={styles.center}>
                    <span className={styles.countBadge}>{u.bookingCount}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${u.isActive ? styles.active : styles.disabled}`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.toggleBtn} ${u.isActive ? styles.toggleDisable : styles.toggleEnable}`}
                      onClick={() => toggleStatus(u._id)}
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
