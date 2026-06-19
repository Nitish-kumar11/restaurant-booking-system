import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './AdminBookings.module.css';

const STATUS_COLORS = {
  confirmed: { bg: '#EAF4EE', color: '#2D6A4F', label: 'Confirmed' },
  pending:   { bg: '#FBF3E0', color: '#C9952A', label: 'Pending'   },
  cancelled: { bg: '#FCE8E8', color: '#E24B4A', label: 'Cancelled' },
  completed: { bg: '#E6F1FB', color: '#185FA5', label: 'Completed' },
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (p = 1, status = filter) => {
    setLoading(true);
    try {
      const q = status ? `&status=${status}` : '';
      const { data } = await API.get(`/admin/bookings?page=${p}${q}`);
      setBookings(data.bookings);
      setPages(data.pages);
      setPage(data.page);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, filter); /* eslint-disable-next-line */ }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      load(page, filter);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>All Bookings</h1>
          <p className={styles.subtitle}>Manage every table reservation</p>
        </div>
        <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>No bookings found.</div>
      ) : (
        <div className={styles.cardsList}>
          {bookings.map(b => {
            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
            return (
              <div key={b._id} className={styles.bookingCard}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.bookingId}>#{b.bookingId}</div>
                    <div className={styles.customerName}>{b.user?.name}</div>
                    <div className={styles.customerMeta}>{b.user?.email} · {b.user?.phone}</div>
                  </div>
                  <span className={styles.badge} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>

                <div className={styles.detailsGrid}>
                  <div><span className={styles.detailLabel}>Table</span><span>T{b.table?.tableNumber} · {b.table?.section}</span></div>
                  <div><span className={styles.detailLabel}>Date</span><span>{b.date}</span></div>
                  <div><span className={styles.detailLabel}>Time</span><span>{b.timeSlot}</span></div>
                  <div><span className={styles.detailLabel}>Guests</span><span>{b.guests}</span></div>
                </div>

                {b.occasion && b.occasion !== 'Regular Dining' && (
                  <span className={styles.occasionTag}>{b.occasion}</span>
                )}
                {b.requests && <p className={styles.requests}>📝 {b.requests}</p>}

                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <div className={styles.actions}>
                    {b.status === 'pending' && (
                      <button className={styles.btnConfirm} onClick={() => updateStatus(b._id, 'confirmed')}>Confirm</button>
                    )}
                    <button className={styles.btnComplete} onClick={() => updateStatus(b._id, 'completed')}>Mark Completed</button>
                    <button className={styles.btnCancel} onClick={() => updateStatus(b._id, 'cancelled')}>Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => load(page - 1, filter)}>← Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => load(page + 1, filter)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
