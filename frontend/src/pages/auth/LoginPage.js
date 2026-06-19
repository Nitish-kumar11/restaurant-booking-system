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
      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>
      <div className={styles.diagLine1}></div>
      <div className={styles.diagLine2}></div>
      <div className={styles.diagLine3}></div>

      <div className={styles.brandStrip}>
        <div className={styles.brandStripIcon}>🍛</div>
        <div className={styles.brandStripName}>Spice of India</div>
      </div>

      <div className={styles.left}>
        <div className={styles.foodCluster}>
          <span className={`${styles.sparkle} ${styles.sparkle1}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.sparkle2}`}>✦</span>
          <span className={`${styles.sparkle} ${styles.sparkle3}`}>✦</span>

          <div className={`${styles.foodCircle} ${styles.foodCircle1}`}>
            <img
              src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80"
              alt="Indian curry"
            />
          </div>
          <div className={`${styles.foodCircle} ${styles.foodCircle2}`}>
            <img
              src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&q=80"
              alt="Dessert"
            />
          </div>
          <div className={`${styles.foodCircle} ${styles.foodCircle3}`}>
            <img
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80"
              alt="Indian thali"
            />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.eyebrow}>Welcome to Spice of India</div>
          <h2 className={styles.title}>
            Craving <span>something</span> good?
          </h2>
          <p className={styles.sub}>Sign in to reserve your table</p>

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
                placeholder="you@example.com"
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
