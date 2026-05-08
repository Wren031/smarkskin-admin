import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { Lock, Mail, ChevronRight } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/admin/dashboard");
  };

  return (
    <div style={styles.container}>
      <section style={styles.authCard}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span> SECURE ACCESS
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Enter your admin credentials</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Corporate Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.icon} />
              <input
                type="email"
                placeholder="name@company.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.showPassBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <a href="/forgot-password" style={styles.forgotPass}>
              Forgot password?
            </a>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
            <ChevronRight size={18} />
          </button>
        </form>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Protected by hardware-level encryption.
          </p>
        </footer>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  },
  authCard: {
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  header: { textAlign: "center", marginBottom: "20px" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#475569",
  },
  badgeDot: { width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10b981" },
  title: { fontSize: "22px", fontWeight: 800, marginBottom: "4px", color: "#0f172a" },
  subtitle: { color: "#64748b", fontSize: "13px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#334155" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "12px", color: "#94a3b8" },
  input: {
    width: "100%",
    padding: "10px 12px 100px 38px", // Vertical padding reduced
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    backgroundColor: "#fcfcfc",
  },
  showPassBtn: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#64748b",
  },
  optionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" },
  checkbox: { width: "14px", height: "14px", cursor: "pointer" },
  forgotPass: { fontSize: "12px", color: "#0f172a", fontWeight: 600, textDecoration: "none" },
  loginButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "6px",
    transition: "background 0.2s",
  },
  errorText: { color: "#ef4444", fontSize: "12px", textAlign: "center" },
  footer: { marginTop: "20px", textAlign: "center" },
  footerText: { fontSize: "11px", color: "#94a3b8" },
};