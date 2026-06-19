import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './UserLayout.module.css';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 🙏');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard',          icon: '🏠', label: 'Dashboard'   },
    { to: '/dashboard/book',     icon: '🪑', label: 'Book a Table' },
    { to: '/dashboard/bookings', icon: '📋', label: 'My Bookings'  },
    { to: '/dashboard/profile',  icon: '👤', label: 'Profile'      },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sideOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🍛</div>
          <div>
            <div className={styles.brandName}>Spice of India</div>
            <div className={styles.brandSub}>Customer Portal</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.to === '/dashboard'}
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
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {sideOpen && <div className={styles.overlay} onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSideOpen(!sideOpen)}>☰</button>
          <div className={styles.headerTitle}>
            <span className={styles.greeting}>Namaste,</span> {user?.name?.split(' ')[0]} 🙏
          </div>
          <div className={styles.headerRight}>
            <span className={styles.roleBadge}>Customer</span>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
