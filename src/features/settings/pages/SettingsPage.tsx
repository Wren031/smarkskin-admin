import { type ChangeEvent, type CSSProperties, useRef, useState, useEffect } from "react";
import { Camera, Shield, User, Building2, Save, X, Mail, Phone, MapPin, Globe, Activity } from "lucide-react";
import TitleSize from "../../../styles/TitleSize";

const theme = {
  primary: "#0f172a",
  accent: "#2563eb",
  border: "#e2e8f0",
  textMain: "#0f172a",
  textMuted: "#64748b",
  success: "#10b981",
};

interface FormData {
  fullName: string;
  residence: string;
  email: string;
  contact: string;
  company: string;
  address: string;
  profileImg: string;
}

export default function SettingsPage() {
  // --- 1. Hooks & State ---
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initial loading state
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "Wren Montero Javier",
    residence: "789 Orchard St, San Francisco, CA 94107",
    email: "javierrenren1@gmail.com",
    contact: "09158952698",
    company: "Global Tech Industries",
    address: "500 Innovation Way, Silicon Valley, CA 95054",
    profileImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  });

  // --- 2. Simulation of Data Loading ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate initial fetch
    return () => clearTimeout(timer);
  }, []);

  // --- 3. Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImg: imageUrl }));
    }
  };

  // --- 4. Loading State (Internal to keep Sidebar) ---
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loaderArea}>
          <Activity className="animate-spin" size={40} color={theme.primary} />
          <p style={{ marginTop: 16, color: theme.textMuted, fontWeight: 500 }}>
            Loading Account Preferences...
          </p>
        </div>
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // --- 5. Main Content ---
  return (
    <div style={styles.wrapper}>
      <style>
        {`
          .settings-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .responsive-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 16px; }

          @media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } }
          @media (max-width: 640px) {
            .form-grid { grid-template-columns: 1fr; }
            .responsive-header { flex-direction: column; align-items: flex-start; }
            .btn-edit { width: 100%; justify-content: center; }
            .profile-hero { flex-direction: column; align-items: flex-start !important; text-align: left; }
          }

          .input-field {
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid ${theme.border};
            width: 100%;
            height: 42px;
            border-radius: 10px;
            font-size: 14px;
            padding: 0 12px;
            background: transparent;
            box-sizing: border-box;
          }

          .input-field:focus {
            border-color: ${theme.accent} !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            outline: none;
          }
          
          .input-field:disabled {
            border-color: transparent;
            padding-left: 0 !important;
            cursor: default;
            color: ${theme.textMain};
            font-weight: 500;
          }
        `}
      </style>

      <div style={styles.container}>
        <header className="responsive-header">
          <TitleSize
            title="Account Settings"
            subtitle="Update your profile and organizational presence."
          />
          {!isEditing && (
            <button className="btn-edit" style={styles.btnPrimary} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </header>

        {/* PROFILE HERO */}
        <section className="profile-hero" style={styles.profileHero}>
          <div 
            style={styles.avatarWrapper} 
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            <img src={formData.profileImg} alt="Profile" style={styles.avatarImg} />
            {isEditing && (
              <div style={styles.avatarOverlay}>
                <Camera size={20} color="white" />
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div style={styles.heroText}>
            <h2 style={styles.userName}>{formData.fullName}</h2>
            <div style={styles.badgeRow}>
              <span style={styles.infoBadge}><Mail size={12} /> {formData.email}</span>
              <span style={styles.infoBadge}><Building2 size={12} /> {formData.company}</span>
            </div>
          </div>
        </section>

        <div className="settings-grid">
          {/* LEFT COLUMN */}
          <div style={styles.column}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <User size={16} color={theme.accent} />
                <span style={styles.sectionLabel}>Identity Details</span>
              </div>
              <div className="form-grid">
                <InputGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} />
                <InputGroup label="Phone" name="contact" value={formData.contact} onChange={handleInputChange} disabled={!isEditing} icon={<Phone size={14} />} />
                <div style={{ gridColumn: "span 1" }}>
                   <InputGroup label="Location" name="residence" value={formData.residence} onChange={handleInputChange} disabled={!isEditing} icon={<MapPin size={14} />} />
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <Shield size={16} color={theme.accent} />
                <span style={styles.sectionLabel}>Security</span>
              </div>
              <div className="form-grid">
                <InputGroup label="New Password" type="password" placeholder="••••••••" disabled={!isEditing} />
                <InputGroup label="Confirm Password" type="password" placeholder="••••••••" disabled={!isEditing} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={styles.column}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <Building2 size={16} color={theme.accent} />
                <span style={styles.sectionLabel}>Organization</span>
              </div>
              <div style={styles.stack}>
                <InputGroup label="Company" name="company" value={formData.company} onChange={handleInputChange} disabled={!isEditing} icon={<Globe size={14} />} />
                <div style={styles.fieldWrapper}>
                  <label style={styles.fieldLabel}>Address</label>
                  <textarea
                    className="input-field"
                    style={{ ...styles.textArea, border: isEditing ? `1px solid ${theme.border}` : "1px solid transparent", paddingLeft: isEditing ? "12px" : "0" }}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div style={styles.actionRow}>
                <button style={styles.btnGhost} onClick={() => setIsEditing(false)}>
                  <X size={16} /> Cancel
                </button>
                <button
                  style={{ ...styles.btnPrimary, backgroundColor: theme.success }}
                  onClick={() => setIsEditing(false)}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({ label, icon, disabled, ...props }: any) => (
  <div style={styles.fieldWrapper}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={{ position: "relative" }}>
      {icon && !disabled && <div style={styles.inputIcon}>{icon}</div>}
      <input 
        className="input-field" 
        disabled={disabled}
        style={{ paddingLeft: icon && !disabled ? "38px" : disabled ? "0" : "12px" }} 
        {...props} 
      />
    </div>
  </div>
);

const styles: Record<string, CSSProperties> = {
  wrapper: { minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "clamp(16px, 4vw, 40px)" },
  container: { maxWidth: "1000px", margin: "0 auto" },
  loaderArea: {
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "48px",
    paddingBottom: "32px",
    borderBottom: `1px solid ${theme.border}`
  },
  avatarWrapper: {
    position: "relative",
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#f1f5f9",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: { display: "flex", flexDirection: "column", gap: "6px" },
  userName: { margin: 0, fontSize: "22px", fontWeight: 700, color: theme.textMain },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
  infoBadge: { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    fontSize: "13px", 
    color: theme.textMuted,
  },
  column: { display: "flex", flexDirection: "column", gap: "40px" },
  section: { display: "flex", flexDirection: "column" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  sectionLabel: { fontSize: "14px", fontWeight: 700, color: theme.textMain, textTransform: "uppercase", letterSpacing: "0.03em" },
  stack: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "12px", fontWeight: 600, color: theme.textMuted },
  textArea: {
    width: "100%",
    height: "80px",
    fontSize: "14px",
    color: theme.textMain,
    resize: "none",
    boxSizing: "border-box",
    background: "transparent",
    outline: "none"
  },
  inputIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
  btnPrimary: {
    padding: "10px 20px",
    backgroundColor: theme.primary,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btnGhost: {
    background: "transparent",
    border: `1px solid ${theme.border}`,
    color: theme.textMain,
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  actionRow: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" },
};