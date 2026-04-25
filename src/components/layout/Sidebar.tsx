import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Sparkles,
  FileText,
  Settings,
  User,
  Dna,
  LogOut,
  UserRoundSearch,
  HeartPulse,
} from "lucide-react";

// --- Types ---
type MenuItem = { to: string; label: string; icon: React.ElementType; section?: string };
type SidebarProps = {
  collapsed: boolean;
  user: { name: string; phone: string };
  onLogout: () => void;
};

// --- Menu Configuration ---
const MENU: MenuItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users, section: "Management" },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/recommendation", label: "Recommendations", icon: Sparkles, section: "Analysis" },
  { to: "/admin/condition", label: "Skin Analysis", icon: Dna },
  { to: "/admin/users-scan", label: "Diagnostic History", icon: UserRoundSearch },
  { to: "/admin/lifestyle", label: "Lifestyle Tips", icon: HeartPulse, section: "Content" },
  { to: "/admin/report", label: "Reports", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings, section: "System" },
];

export default function Sidebar({ collapsed, user, onLogout }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isExpanded = !collapsed || isHovered;

  return (
    <>
      <style>{dynamicStyles}</style>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.sidebar,
          width: isExpanded ? "280px" : "80px",
        }}
      >
        {/* Profile Section */}
        <div style={styles.profileWrapper}>
          <div style={{
            ...styles.profileCard,
            justifyContent: isExpanded ? "flex-start" : "center",
            backgroundColor: isExpanded ? "#f8fafc" : "transparent"
          }}>
            <div style={styles.avatar}>
              <User size={20} color="#fff" strokeWidth={2.5} />
            </div>
            {isExpanded && (
              <div style={styles.profileText}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userBadge}>Administrator</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={styles.navScroll}>
          {MENU.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            
            return (
              <React.Fragment key={item.to}>
                {item.section && isExpanded && (
                  <div style={styles.sectionHeader}>{item.section}</div>
                )}
                
                <NavLink to={item.to} style={{ textDecoration: "none" }}>
                  <div 
                    className={`nav-item ${isActive ? "active" : ""}`}
                    style={{
                      ...styles.navItem,
                      justifyContent: isExpanded ? "flex-start" : "center",
                    }}
                  >
                    <Icon 
                      size={20} 
                      className="nav-icon"
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{ flexShrink: 0 }}
                    />
                    {isExpanded && (
                      <span style={styles.navLabel}>{item.label}</span>
                    )}
                  </div>
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            onClick={onLogout} 
            className="logout-btn"
            style={{
              ...styles.logoutAction,
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
          >
            <LogOut size={20} color="#e11d48" style={{ flexShrink: 0 }} />
            {isExpanded && (
              <span style={{ ...styles.navLabel, color: "#e11d48" }}>Sign Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    height: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1000,
    overflow: "hidden", // Keep the rail clean
  },
  profileWrapper: { padding: "20px 14px", flexShrink: 0 },
  profileCard: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "12px",
    gap: "12px",
    transition: "all 0.3s ease",
  },
  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileText: {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "nowrap",
    animation: "fadeIn 0.4s ease forwards",
  },
  userName: { fontSize: "14px", fontWeight: 700, color: "#0f172a" },
  userBadge: { fontSize: "11px", color: "#94a3b8" },
  navScroll: { flex: 1, padding: "0 14px", overflowY: "auto", overflowX: "hidden" },
  sectionHeader: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "24px 12px 8px",
    animation: "fadeIn 0.3s ease forwards",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    margin: "4px 0",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  navLabel: {
    marginLeft: "12px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#475569",
    whiteSpace: "nowrap",
    animation: "fadeIn 0.3s ease forwards",
  },
  footer: { padding: "16px 14px", borderTop: "1px solid #f1f5f9" },
  logoutAction: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  }
};

const dynamicStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-5px); }
    to { opacity: 1; transform: translateX(0); }
  }

  nav::-webkit-scrollbar { width: 0; }
  
  .nav-item:hover { background-color: #f8fafc; }
  
  .nav-item.active {
    background-color: #0f172a;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  }
  
  .nav-item.active .nav-icon { color: #ffffff !important; }
  .nav-item.active span { color: #ffffff !important; }
  
  .nav-icon { color: #64748b; }
  .nav-item:hover .nav-icon { color: #0f172a; }
  .nav-item.active:hover .nav-icon { color: #ffffff; }

  .logout-btn:hover { background-color: #fff1f2; }
`;