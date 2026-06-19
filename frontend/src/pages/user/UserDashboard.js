import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import styles from './UserDashboard.module.css';

const STATUS_COLORS = {
  confirmed: { bg: '#EAF4EE', color: '#2D6A4F', label: '✓ Confirmed' },
  pending:   { bg: '#FBF3E0', color: '#C9952A', label: '⏳ Pending'  },
  cancelled: { bg: '#FCE8E8', color: '#E24B4A', label: '✗ Cancelled' },
  completed: { bg: '#E6F1FB', color: '#185FA5', label: '✔ Completed' },
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/bookings/my').then(r => { setBookings(r.data.bookings); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    upcoming:  bookings.filter(b => b.status === 'confirmed' && b.date >= new Date().toISOString().split('T')[0]).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const recent = bookings.slice(0, 3);

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Namaste, {user?.name?.split(' ')[0]}! 🙏</h1>
          <p className={styles.welcomeSub}>Welcome to Spice of India — your table awaits.</p>
        </div>
        <Link to="/dashboard/book" className={styles.bookBtn}>+ Book a Table</Link>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Total Reservations', value: stats.total,     icon: '📋', color: 'saffron' },
          { label: 'Confirmed',          value: stats.confirmed, icon: '✅', color: 'green'   },
          { label: 'Upcoming',           value: stats.upcoming,  icon: '📅', color: 'blue'    },
          { label: 'Cancelled',          value: stats.cancelled, icon: '❌', color: 'red'     },
        ].map(s => (
          <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/dashboard/book" className={styles.actionCard}>
            <span className={styles.actionIcon}>🪑</span>
            <div className={styles.actionLabel}>Reserve a Table</div>
            <div className={styles.actionDesc}>Book your perfect spot</div>
          </Link>
          <Link to="/dashboard/bookings" className={styles.actionCard}>
            <span className={styles.actionIcon}>📋</span>
            <div className={styles.actionLabel}>View Bookings</div>
            <div className={styles.actionDesc}>Manage reservations</div>
          </Link>
          <Link to="/dashboard/profile" className={styles.actionCard}>
            <span className={styles.actionIcon}>👤</span>
            <div className={styles.actionLabel}>My Profile</div>
            <div className={styles.actionDesc}>Update your details</div>
          </Link>
        </div>
      </div>

      <div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Bookings</h2>
          <Link to="/dashboard/bookings" className={styles.viewAll}>View all →</Link>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : recent.length === 0 ? (
          <div className={styles.empty}>
            <span>🍽</span>
            <p>No reservations yet.</p>
            <Link to="/dashboard/book" className={styles.bookBtn}>Make your first booking</Link>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {recent.map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <div key={b._id} className={styles.bookingCard}>
                  <div className={styles.bookingLeft}>
                    <div className={styles.bookingId}>#{b.bookingId}</div>
                    <div className={styles.bookingInfo}>{b.table?.section} · Table {b.table?.tableNumber}</div>
                    <div className={styles.bookingMeta}>{b.date} · {b.timeSlot} · {b.guests} guests</div>
                    {b.occasion && b.occasion !== 'Regular Dining' && (
                      <span className={styles.occasionTag}>{b.occasion}</span>
                    )}
                  </div>
                  <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
