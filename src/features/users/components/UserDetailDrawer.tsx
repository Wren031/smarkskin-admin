import React from 'react';
import { 
  X, 
  Printer, 
  Phone, 
  MapPin, 
  Calendar, 
  User as UserIcon,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { User } from '../types/User';
import type { CSSProperties } from 'react';

// --- Helper Functions ---
const getFullName = (user: User): string => {
  const { first_name, middle_name, last_name, suffix } = user;
  return [first_name, middle_name, last_name, suffix]
    .filter((name): name is string => Boolean(name && name.trim()))
    .join(' ');
};

const formatDate = (dateValue?: number | string | Date): string => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

// --- Sub-Component: DataField ---
const DataField = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => (
  <div style={styles.fieldContainer}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={styles.fieldValueBox}>
      {Icon && <Icon size={14} style={{ color: '#94a3b8', marginRight: '8px' }} />}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || 'Not Provided'}</span>
    </div>
  </div>
);

// --- Main Component ---
interface UserDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const fullName = getFullName(user);

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* Animation Styles injected only when component is mounted */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-panel { 
            animation: slideInRight 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); 
            will-change: transform;
        }
      `}</style>

      <div 
        className="drawer-panel" 
        style={styles.drawer} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.iconBox}><UserIcon size={20} /></div>
            <div>
              <h2 style={styles.title}>User Dossier</h2>
              <p style={styles.subtitle}>REF-{user.id?.toString().padStart(5, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} title="Close drawer">
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={styles.scrollArea}>
          {/* PROFILE SUMMARY CARD */}
          <div style={styles.profileHero}>
            <div style={styles.avatarWrapper}>
              {user.avatar_url ? (
                <img src={user.avatar_url} style={styles.avatar} alt={fullName} />
              ) : (
                <div style={styles.avatarPlaceholder}><UserIcon size={32} /></div>
              )}
              <div style={{
                ...styles.statusDot, 
                backgroundColor: user.status === 'Active' ? '#22c55e' : '#94a3b8'
              }} />
            </div>
            <div>
              <h3 style={styles.displayName}>{fullName}</h3>
              <div style={styles.heroBadge}>{user.status || 'Active'} Account</div>
            </div>
          </div>

          {/* DATA SECTIONS */}
          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>Core Information</h4>
            <div style={styles.grid}>
              <DataField label="Birthday" value={formatDate(user.date_of_birth)} icon={Calendar} />
              <DataField label="Gender" value={user.gender} />
            </div>
          </section>

          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>Contact Channels</h4>
            <DataField label="Phone" value={user.phone_number} icon={Phone} />
            <DataField label="Address" value={user.address} icon={MapPin} />
          </section>

          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>System Audit</h4>
            <div style={styles.auditBox}>
               <div style={styles.auditRow}>
                 <Clock size={16} color="#64748b" />
                 <div>
                   <div style={styles.auditTime}>
                     {new Date(user.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div style={styles.auditDate}>{formatDate(user.updated_at)}</div>
                 </div>
               </div>
               <div style={styles.regDate}>
                 Registered on {formatDate(user.created_at)}
               </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div style={styles.footer}>
          <button style={styles.secondaryBtn} onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
          <button style={styles.primaryBtn}>
            <ExternalLink size={16} /> Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailDrawer;

// --- Styles Object ---
const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: 1500,
    display: "flex",
    justifyContent: "flex-end"
  },
  drawer: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-10px 0 40px rgba(0,0,0,0.12)",
  },
  header: {
    padding: "24px 32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInfo: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: {
    width: "40px", height: "40px", borderRadius: "10px",
    backgroundColor: "#f8fafc", color: "#0f172a",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  title: { margin: 0, fontSize: "17px", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px" },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "8px", cursor: "pointer", color: "#64748b" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "32px" },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "20px",
    border: "1px solid #f1f5f9"
  },
  avatarWrapper: { position: "relative" },
  avatar: { width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover" },
  avatarPlaceholder: { 
    width: "64px", height: "64px", borderRadius: "16px", 
    backgroundColor: "#eff6ff", color: "#3b82f6", 
    display: "flex", alignItems: "center", justifyContent: "center" 
  },
  statusDot: { 
    position: "absolute", bottom: "-2px", right: "-2px", 
    width: "14px", height: "14px", borderRadius: "50%", border: "3px solid #f8fafc" 
  },
  displayName: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" },
  heroBadge: { fontSize: "11px", fontWeight: 700, color: "#64748b", marginTop: "4px", textTransform: 'uppercase' },
  section: { marginBottom: "32px" },
  sectionLabel: { fontSize: "11px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  fieldContainer: { marginBottom: "12px" },
  fieldLabel: { fontSize: "12px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px", display: "block" },
  fieldValueBox: {
    display: "flex", alignItems: "center", padding: "10px 14px",
    fontSize: "13px", fontWeight: 600, backgroundColor: "#fff",
    borderRadius: "10px", border: "1px solid #f1f5f9", color: "#1e293b",
  },
  auditBox: { padding: "16px", backgroundColor: "#fff", border: "1px solid #f1f5f9", borderRadius: "12px" },
  auditRow: { display: "flex", gap: "12px", alignItems: "center" },
  auditTime: { fontWeight: 700, fontSize: "14px", color: "#0f172a" },
  auditDate: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 },
  regDate: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f8fafc", fontSize: "11px", color: "#94a3b8", fontStyle: "italic" },
  footer: { padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "12px", marginTop: "auto" },
  primaryBtn: { 
    flex: 2, background: "#0f172a", color: "#fff", border: "none", 
    height: "44px", borderRadius: "10px", fontWeight: 600, fontSize: "13px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" 
  },
  secondaryBtn: { 
    flex: 1, background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", 
    height: "44px", borderRadius: "10px", fontWeight: 600, fontSize: "13px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" 
  }
};