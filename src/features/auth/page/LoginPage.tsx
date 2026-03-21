import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import type { CSSProperties } from "react";

export default function LoginPage() {
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd check credentials here.
    // For now, we go straight to the dashboard:
    navigate("/app"); 
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          }
          .input-field:focus {
            background: rgba(255, 255, 255, 0.25) !important;
            outline: 2px solid rgba(255, 255, 255, 0.5);
          }
          .login-btn:hover {
            background: #f8fafc !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          .login-btn:active {
            transform: translateY(0);
          }
        `}
      </style>

      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Please enter your details</p>
        </div>

        {/* 3. Attach handleLogin to onSubmit */}
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@company.com" 
              className="input-field"
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <a href="#" style={styles.link}>Forgot?</a>
            </div>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="input-field"
              style={styles.input} 
            />
          </div>

          <button type="submit" className="login-btn" style={styles.button}>
            Sign In
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <a href="#" style={{...styles.link, fontWeight: 'bold'}}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

// ... styles remain exactly the same as your provided code ...
const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  label: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#ffffff',
    color: '#0f172a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '13px',
  },
  footerText: {
    marginTop: '24px',
    color: '#94a3b8',
    fontSize: '14px',
  }
};