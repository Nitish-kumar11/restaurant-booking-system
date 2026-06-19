import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const res = await register(
      form.name,
      form.email,
      form.password,
      form.phone,
    );
    if (res.success) {
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } else toast.error(res.message);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.ornament}>✦ ॐ ✦</div>
          <h1>Spice of India</h1>
          <p>Join Our Family</p>
          <div className={styles.features}>
            <div className={styles.feature}>✅ Free to register</div>
            <div className={styles.feature}>🪑 Instant table booking</div>
            <div className={styles.feature}>📱 Manage from anywhere</div>
            <div className={styles.feature}>🎂 Birthday & occasion perks</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create nesw Account</h2>
          <p className={styles.sub}>Start reserving tables today</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type="text"
                value={form.name}
                required
                placeholder="e.g. Nitish Kumar"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
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
              <label>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                required
                placeholder="Min. 6 characters"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className={styles.switchLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
