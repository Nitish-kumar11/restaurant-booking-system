import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success("Welcome back! 🙏");
      navigate(res.role === "admin" ? "/admin" : "/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin")
      setForm({ email: "nitish@spiceofindia.com", password: "nitish123" });
    else setForm({ email: "jagriti@gmail.com", password: "user123" });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.ornament}>✦ ॐ ✦</div>
          <h1>Spice of India</h1>
          <p>Authentic Indian Cuisine Since 2002</p>
          <div className={styles.features}>
            <div className={styles.feature}>🪑 Reserve Tables Online</div>
            <div className={styles.feature}>🍛 Explore Authentic Cuisine</div>
            <div className={styles.feature}>🎉 Celebrate Special Occasions</div>
            <div className={styles.feature}>📋 Manage Your Bookings</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.sub}>Sign in to your account</p>

          <div className={styles.demoButtons}>
            <button className={styles.demoBtn} onClick={() => fillDemo("user")}>
              👤 Demo User
            </button>
            <button
              className={`${styles.demoBtn} ${styles.demoBtnAdmin}`}
              onClick={() => fillDemo("admin")}
            >
              🔧 Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                required
                placeholder="Email@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                required
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className={styles.switchLink}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
