import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../../utils/api';
import styles from './AdminDashboard.module.css';

const STATUS_COLORS = {
  confirmed: { bg: '#EAF4EE', color: '#2D6A4F', label: 'Confirmed' },
  pending:   { bg: '#FBF3E0', color: '#C9952A', label: 'Pending'   },
  cancelled: { bg: '#FCE8E8', color: '#E24B4A', label: 'Cancelled' },
  completed: { bg: '#E6F1FB', color: '#185FA5', label: 'Completed' },
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Loading dashboard...</p>;
  if (!data) return <p className={styles.loading}>Could not load dashboard data.</p>;

  const { stats, recentBookings, chartData } = data;

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: 'saffron' },
    { label: 'Total Users',    value: stats.totalUsers,    icon: '👥', color: 'blue'    },
    { label: 'Active Tables',  value: stats.totalTables,   icon: '🪑', color: 'green'   },
    { label: 'Confirmed',      value: stats.confirmed,     icon: '✅', color: 'green'   },
    { label: 'Pending',        value: stats.pending,       icon: '⏳', color: 'gold'    },
    { label: 'Cancelled',      value: stats.cancelled,     icon: '❌', color: 'red'     },
  ];

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard Overview</h1>
      <p className={styles.subtitle}>Welcome back — here's what's happening at Spice of India.</p>

      <div className={styles.statsGrid}>
        {cards.map(c => (
          <div key={c.label} className={`${styles.statCard} ${styles[c.color]}`}>
            <span className={styles.statIcon}>{c.icon}</span>
            <div className={styles.statValue}>{c.value}</div>
            <div className={styles.statLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.sectionTitle}>Bookings — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData.map(d => ({ ...d, date: fmtDate(d.date) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8DDD0', fontSize: 13 }} />
            <Bar dataKey="count" fill="#E8832A" radius={[6, 6, 0, 0]} name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.recentCard}>
        <h2 className={styles.sectionTitle}>Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className={styles.empty}>No bookings yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th><th>Customer</th><th>Table</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => {
                  const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={b._id}>
                      <td className={styles.mono}>#{b.bookingId}</td>
                      <td>{b.user?.name || '—'}</td>
                      <td>T{b.table?.tableNumber} · {b.table?.section}</td>
                      <td>{b.date}</td>
                      <td>{b.timeSlot}</td>
                      <td>{b.guests}</td>
                      <td><span className={styles.badge} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
