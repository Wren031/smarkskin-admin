import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

const profileImageSrc = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness via window listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Tab Content Components ---

  const ProfileContent = () => (
    <>
      <section style={styles.contentSection}>
        <div style={styles.sectionLabel}>Avatar</div>
        <div style={styles.avatarRow}>
          <img src={profileImageSrc} alt="User" style={styles.avatar} />
          <div style={styles.avatarActions}>
            <button style={styles.btnGhost}>Upload new image</button>
            <span style={styles.helperText}>JPG, GIF or PNG. Max size of 800K</span>
          </div>
        </div>
      </section>
      <div style={styles.divider} />
      <section style={{ 
        ...styles.formGrid, 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" 
      }}>
        <div style={styles.inputWrapper}>
          <label style={styles.fieldLabel}>Display Name</label>
          <input style={styles.input} type="text" defaultValue="John Doe" />
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.fieldLabel}>Email Address</label>
          <input style={styles.input} type="email" defaultValue="johndoe@gmail.com" />
        </div>
        <div style={{ ...styles.inputWrapper, gridColumn: isMobile ? "span 1" : "span 2" }}>
          <label style={styles.fieldLabel}>Bio</label>
          <textarea style={styles.textarea} defaultValue="Senior Product Designer based in the Philippines." />
        </div>
      </section>
    </>
  );

  const SecurityContent = () => (
    <div style={styles.formStack}>
      <div style={styles.inputWrapper}>
        <label style={styles.fieldLabel}>Current Password</label>
        <input style={styles.input} type="password" />
      </div>
      <div style={styles.inputWrapper}>
        <label style={styles.fieldLabel}>New Password</label>
        <input style={styles.input} type="password" />
      </div>
      <div style={{
        ...styles.prefRow, 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={styles.prefTitle}>Two-Factor Authentication</div>
          <div style={styles.helperText}>Add an extra layer of security to your account.</div>
        </div>
        <button style={styles.btnPrimary}>Enable</button>
      </div>
    </div>
  );

  const NotificationContent = () => (
    <div style={styles.formStack}>
      {[
        { t: "Security Alerts", d: "Get notified of new login attempts." },
        { t: "Desktop Notifications", d: "Show notifications on your system tray." },
        { t: "Marketing Emails", d: "Updates about new features and products." }
      ].map((item, i) => (
        <div key={i} style={styles.prefRow}>
          <div style={{ flex: 1, paddingRight: '10px' }}>
            <div style={styles.prefTitle}>{item.t}</div>
            <div style={styles.helperText}>{item.d}</div>
          </div>
          <input type="checkbox" defaultChecked={i < 2} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={{ 
        ...styles.appContainer, 
        flexDirection: isMobile ? "column" : "row",
        width: isMobile ? "100%" : "840px",
        height: isMobile ? "auto" : "600px",
        minHeight: isMobile ? "100vh" : "600px",
        borderRadius: isMobile ? "0px" : "10px"
      }}>
        {/* Sidebar */}
        <aside style={{ 
          ...styles.sidebar, 
          width: isMobile ? "100%" : "200px",
          borderRight: isMobile ? "none" : "1px solid #F0F0F0",
          borderBottom: isMobile ? "1px solid #F0F0F0" : "none"
        }}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logoDot} />
            <span style={styles.sidebarTitle}>Settings</span>
          </div>
          <nav style={{ 
            ...styles.navStack, 
            flexDirection: isMobile ? "row" : "column",
            overflowX: isMobile ? "auto" : "visible"
          }}>
            <button 
              onClick={() => setActiveTab("profile")} 
              style={activeTab === "profile" ? {...styles.navItem, ...styles.navItemActive} : styles.navItem}
            >
              General
            </button>
            <button 
              onClick={() => setActiveTab("security")} 
              style={activeTab === "security" ? {...styles.navItem, ...styles.navItemActive} : styles.navItem}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab("notifications")} 
              style={activeTab === "notifications" ? {...styles.navItem, ...styles.navItemActive} : styles.navItem}
            >
              Alerts
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main style={styles.mainContent}>
          <header style={{
            ...styles.contentHeader, 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: isMobile ? '12px' : '16px', 
            alignItems: isMobile ? 'flex-start' : 'center',
            padding: isMobile ? '16px 20px' : '20px 32px'
          }}>
            <h1 style={styles.sectionTitle}>
              {activeTab === "profile" && "General Profile"}
              {activeTab === "security" && "Security & Authentication"}
              {activeTab === "notifications" && "Notification Preferences"}
            </h1>
            <div style={styles.buttonGroup}>
              <button style={styles.btnSecondary}>Discard</button>
              <button style={styles.btnPrimary}>Save Changes</button>
            </div>
          </header>

          <div style={{...styles.scrollArea, padding: isMobile ? '20px' : '32px'}}>
            {activeTab === "profile" && <ProfileContent />}
            {activeTab === "security" && <SecurityContent />}
            {activeTab === "notifications" && <NotificationContent />}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  pageWrapper: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: 'Inter, -apple-system, sans-serif',
    color: "#111",
  },
  appContainer: {
    backgroundColor: "#FFF",
    border: "1px solid #E0E0E0",
    display: "flex",
    boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  sidebar: {
    padding: "16px 10px",
    backgroundColor: "#FAFAFA",
    flexShrink: 0
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px 16px 12px",
  },
  logoDot: {
    width: "12px",
    height: "12px",
    backgroundColor: "#000",
    borderRadius: "3px",
  },
  sidebarTitle: {
    fontWeight: 600,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    color: "#888",
  },
  navStack: {
    display: "flex",
    gap: "4px",
  },
  navItem: {
    background: "transparent",
    border: "none",
    textAlign: "left",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#555",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0
  },
  navItemActive: {
    backgroundColor: "#EFEFEF",
    color: "#000",
    fontWeight: 500,
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0F0F0",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 600,
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  btnPrimary: {
    backgroundColor: "#000",
    color: "#FFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
  },
  btnSecondary: {
    backgroundColor: "#FFF",
    border: "1px solid #E0E0E0",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
  },
  scrollArea: {
    overflowY: "auto",
    flex: 1
  },
  contentSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionLabel: {
    fontWeight: 600,
    color: "#111",
    fontSize: "12px"
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#EEE",
    flexShrink: 0
  },
  avatarActions: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  btnGhost: {
    background: "none",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    padding: "4px 10px",
    fontSize: "11px",
    cursor: "pointer",
    width: "fit-content",
    color: "#444",
  },
  helperText: {
    fontSize: "11px",
    color: "#888",
    lineHeight: "1.4"
  },
  divider: {
    height: "1px",
    backgroundColor: "#F0F0F0",
    margin: "24px 0",
  },
  formGrid: {
    display: "grid",
    gap: "20px",
  },
  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "100%",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    fontWeight: 500,
    color: "#666",
    fontSize: "12px"
  },
  input: {
    border: "1px solid #E0E0E0",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#FFF",
  },
  textarea: {
    border: "1px solid #E0E0E0",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    height: "80px",
    resize: "none",
    fontFamily: "inherit",
  },
  prefRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#FAFAFA",
    borderRadius: "8px",
    border: "1px solid #F0F0F0",
  },
  prefTitle: {
    fontWeight: 500,
    fontSize: "12px",
    marginBottom: "2px"
  }
};