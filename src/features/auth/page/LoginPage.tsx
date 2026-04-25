import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { Lock, Mail, ChevronRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div style={styles.container}>
      <section style={styles.authSide}>
        <div style={styles.loginWrapper}>
          <div style={styles.header}>
            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              SECURE ACCESS
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Corporate Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  style={styles.input}
                  required 
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={styles.label}>Password</label>
                <a href="#" style={styles.forgotPass}>Forgot password?</a>
              </div>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  style={styles.input}
                  required 
                />
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
                Remember this session
              </label>
            </div>

            <button type="submit" style={styles.loginButton}>
              Sign In <ChevronRight size={18} />
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.line}></div>
          </div>

          <button style={styles.googleButton}>
            <FcGoogle size={20} />
            Single Sign-On (SSO)
          </button>

          <footer style={styles.footer}>
            <p style={styles.footerText}>
              Protected by hardware-level encryption. <br />
              <a href="#" style={styles.link}>Security Policy</a>
            </p>
          </footer>
        </div>
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
    backgroundColor: "#f8fafc", // Light gray background for the whole page
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  authSide: {
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "60px 40px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    margin: "20px",
  },
  loginWrapper: {
    width: "100%",
  },
  header: { marginBottom: "40px", textAlign: "center" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "6px 12px",
    borderRadius: "100px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: "20px",
  },
  badgeDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981" },
  title: { fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.02em" },
  subtitle: { fontSize: "16px", color: "#64748b", fontWeight: 400 },

  form: { display: "flex", flexDirection: "column", gap: "24px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: 600, color: "#334155", textAlign: "left" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "14px", color: "#94a3b8" },
  input: {
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    transition: "all 0.2s",
    outline: "none",
    backgroundColor: "#f8fafc",
  },
  forgotPass: { fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: 600 },
  optionsRow: { display: "flex", alignItems: "center" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569", cursor: "pointer" },
  checkbox: { width: "18px", height: "18px", cursor: "pointer", accentColor: "#0f172a" },
  
  loginButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  divider: { display: "flex", alignItems: "center", margin: "32px 0", gap: "16px" },
  line: { flex: 1, height: "1px", backgroundColor: "#f1f5f9" },
  dividerText: { fontSize: "12px", color: "#94a3b8", fontWeight: 500 },
  
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "100%",
    padding: "12px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  footer: { marginTop: "48px", textAlign: "center" },
  footerText: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" },
  link: { color: "#475569", fontWeight: 600, textDecoration: "none" },
};