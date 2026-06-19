import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './AdminTables.module.css';

const SECTIONS = ['Window', 'Main Hall', 'Family', 'Banquet', 'Garden', 'VIP'];
const SECTION_ICON = { Window:'🪟', 'Main Hall':'🍽', Family:'👨‍👩‍👧‍👦', Banquet:'🎉', Garden:'🌿', VIP:'👑' };

const emptyForm = { tableNumber: '', seats: '', section: 'Main Hall', description: '' };

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/tables');
      setTables(data.tables);
    } catch { toast.error('Failed to load tables'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (t) => {
    setForm({ tableNumber: t.tableNumber, seats: t.seats, section: t.section, description: t.description });
    setEditingId(t._id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, tableNumber: +form.tableNumber, seats: +form.seats };
      if (editingId) {
        await API.put(`/admin/tables/${editingId}`, payload);
        toast.success('Table updated');
      } else {
        await API.post('/admin/tables', payload);
        toast.success('Table added');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this table? It will no longer be bookable.')) return;
    try {
      await API.delete(`/admin/tables/${id}`);
      toast.success('Table deactivated');
      load();
    } catch { toast.error('Failed to deactivate'); }
  };

  const toggleActive = async (t) => {
    try {
      await API.put(`/admin/tables/${t._id}`, { isActive: !t.isActive });
      toast.success(t.isActive ? 'Table deactivated' : 'Table activated');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Manage Tables</h1>
          <p className={styles.subtitle}>Add, edit, or deactivate restaurant tables</p>
        </div>
        <button className={styles.addBtn} onClick={openNew}>+ Add Table</button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading tables...</p>
      ) : (
        <div className={styles.grid}>
          {tables.map(t => (
            <div key={t._id} className={`${styles.tableCard} ${!t.isActive ? styles.inactive : ''}`}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{SECTION_ICON[t.section] || '🍽'}</span>
                <span className={`${styles.statusDot} ${t.isActive ? styles.dotActive : styles.dotInactive}`}>
                  {t.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className={styles.tableNum}>Table {t.tableNumber}</div>
              <div className={styles.tableMeta}>{t.seats} seats · {t.section}</div>
              {t.description && <p className={styles.desc}>{t.description}</p>}
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => openEdit(t)}>Edit</button>
                <button className={styles.toggleBtn} onClick={() => toggleActive(t)}>
                  {t.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editingId ? 'Edit Table' : 'Add New Table'}</h2>
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.field}>
                <label>Table Number</label>
                <input type="number" required value={form.tableNumber}
                  onChange={e => setForm({ ...form, tableNumber: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Seats</label>
                <input type="number" required min="1" value={form.seats}
                  onChange={e => setForm({ ...form, seats: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Section</label>
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
                  {SECTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea rows={2} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Cozy window seat with garden view" />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>{editingId ? 'Save Changes' : 'Add Table'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
