import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin',           icon: '📊', label: 'Dashboard',    end: true },
    { to: '/admin/bookings',  icon: '📋', label: 'Bookings'             },
    { to: '/admin/tables',    icon: '🪑', label: 'Manage Tables'        },
    { to: '/admin/users',     icon: '👥', label: 'Users'                },
  ];

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sideOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🍛</div>
          <div>
            <div className={styles.brandName}>Spice of India</div>
            <div className={styles.brandSub}>Admin Panel</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setSideOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userBox}>
          <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userRole}>Administrator</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {sideOpen && <div className={styles.overlay} onClick={() => setSideOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSideOpen(!sideOpen)}>☰</button>
          <div className={styles.headerTitle}>Admin Dashboard</div>
          <span className={styles.adminBadge}>🔧 Admin</span>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
