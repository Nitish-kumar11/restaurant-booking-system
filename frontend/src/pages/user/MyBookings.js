import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './MyBookings.module.css';

const STATUS_META = {
  confirmed: { bg: '#EAF4EE', color: '#2D6A4F', label: '✓ Confirmed' },
  pending:   { bg: '#FBF3E0', color: '#C9952A', label: '⏳ Pending'   },
  cancelled: { bg: '#FCE8E8', color: '#E24B4A', label: '✗ Cancelled'  },
  completed: { bg: '#E6F1FB', color: '#185FA5', label: '✔ Completed'  },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  const load = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Reservations</h1>
        <div className={styles.filters}>
          {['all','confirmed','pending','cancelled','completed'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter===f ? styles.active : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading your bookings...</p>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>📋</span>
          <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(b => {
            const sm = STATUS_META[b.status] || STATUS_META.pending;
            const isPast = b.date < new Date().toISOString().split('T')[0];
            const canCancel = b.status === 'confirmed' && !isPast;
            return (
              <div key={b._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.bookingId}>#{b.bookingId}</div>
                    <div className={styles.tableInfo}>
                      {b.table?.section} · Table {b.table?.tableNumber} ({b.table?.seats} seats)
                    </div>
                  </div>
                  <span className={styles.badge} style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                </div>

                <div className={styles.meta}>
                  <span>📅 {b.date}</span>
                  <span>🕐 {b.timeSlot}</span>
                  <span>👥 {b.guests} guests</span>
                  {b.occasion && b.occasion !== 'Regular Dining' && <span>🎉 {b.occasion}</span>}
                </div>

                {b.requests && (
                  <div className={styles.requests}>📝 {b.requests}</div>
                )}
                {b.adminNote && (
                  <div className={styles.adminNote}>💬 Admin: {b.adminNote}</div>
                )}

                {canCancel && (
                  <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={() => cancel(b._id)}>Cancel Reservation</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
