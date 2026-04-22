import React, { useMemo, useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, MoreVertical, User, Settings, LogOut } from "lucide-react";

// --- Types ---
interface TopHeaderProps {
  isDesktop: boolean;
  setMobileOpen: (value: boolean) => void;
  userName?: string;
  onToggleSidebar?: () => void; // Added for desktop collapse logic
}

export default function TopHeader({
  isDesktop,
  setMobileOpen,
  userName = "Admin",
}: TopHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <header style={{ 
      ...headerContainerStyle, 
      padding: isDesktop ? "0 40px" : "0 20px" 
    }}>
      <style>{`
        .nav-icon:hover { background-color: #f1f5f9 !important; color: #0f172a !important; }
        .dropdown-item:hover { background-color: #f8fafc; color: #0f172a; }
        .search-trigger:hover { border-color: #cbd5e1 !important; }
      `}</style>

      {/* Left Section */}
      <div style={flexCenterGap(isDesktop ? 24 : 12)}>
        {!isDesktop && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            style={mobileMenuButtonStyle}
          >
            <Menu size={20} />
          </button>
        )}

        {isDesktop && (
          <div style={textGroupStyle}>
            <h2 style={titleStyle}>Welcome back, {userName}</h2>
            <time style={subtitleStyle}>{dateStr}</time>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div style={flexCenterGap(isDesktop ? 20 : 12)}>
        {isDesktop && (
          <div className="search-trigger" style={searchContainerStyle}>
            <Search size={16} style={{ color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search data, reports, or users..." 
              style={searchInputStyle} 
            />
          </div>
        )}
        
        <button type="button" className="nav-icon" style={iconButtonStyle}>
          <div style={notificationBadgeStyle} />
          <Bell size={19} />
        </button>

        {/* --- Profile Dropdown --- */}
        <div style={{ position: "relative" }} ref={menuRef}>
          {isDesktop ? (
            <div 
              style={avatarPlaceholderStyle} 
              onClick={() => setShowMenu(!showMenu)}
            >
              {userName.charAt(0)}
            </div>
          ) : (
            <button 
              type="button" 
              style={moreButtonStyle} 
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={20} />
            </button>
          )}

          {showMenu && (
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{userName}</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Administrator</span>
              </div>
              <div className="dropdown-item" style={dropdownItemStyle}><User size={15} /> Profile</div>
              <div className="dropdown-item" style={dropdownItemStyle}><Settings size={15} /> Settings</div>
              <hr style={dividerStyle} />
              <div className="dropdown-item" style={{ ...dropdownItemStyle, color: "#e11d48" }}>
                <LogOut size={15} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// --- Professional Styles ---

const headerContainerStyle: React.CSSProperties = {
  height: "80px", // Slightly taller for a more spacious feel
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)", // Stronger 2026 blur
  borderBottom: "1px solid #f1f5f9",
  position: "sticky",
  top: 0,
  zIndex: 30,
};

const titleStyle: React.CSSProperties = { 
  margin: 0, 
  fontSize: "1.15rem", 
  fontWeight: 700, 
  color: "#0f172a",
  letterSpacing: "-0.02em" 
};

const subtitleStyle: React.CSSProperties = { 
  fontSize: "0.8rem", 
  color: "#94a3b8", 
  fontWeight: 500,
  marginTop: "2px"
};

const iconButtonStyle: React.CSSProperties = { 
  position: "relative", 
  background: "#ffffff", 
  border: "1px solid #f1f5f9", 
  padding: "10px", 
  cursor: "pointer", 
  color: "#64748b", 
  borderRadius: "12px", 
  display: "flex", 
  alignItems: "center",
  transition: "all 0.2s"
};

const avatarPlaceholderStyle: React.CSSProperties = { 
  width: "40px", 
  height: "40px", 
  borderRadius: "12px", 
  backgroundColor: "#0f172a", 
  color: "white", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  fontWeight: 700, 
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.15)"
};

const searchContainerStyle: React.CSSProperties = { 
  display: "flex", 
  alignItems: "center", 
  gap: "12px", 
  backgroundColor: "#f8fafc", 
  padding: "0 16px", 
  borderRadius: "12px",
  width: "320px",
  height: "44px",
  border: "1px solid #f1f5f9",
  transition: "all 0.2s"
};

const searchInputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "14px",
  fontWeight: 500,
  color: "#0f172a",
  width: "100%"
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "130%",
  right: 0,
  width: "200px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  border: "1px solid #f1f5f9",
  padding: "8px",
  zIndex: 100,
};

const dropdownHeaderStyle: React.CSSProperties = {
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  borderBottom: "1px solid #f1f5f9",
  marginBottom: "6px"
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 12px",
  fontSize: "13.5px",
  color: "#64748b",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.2s",
};

const dividerStyle: React.CSSProperties = { 
  border: "0", 
  borderTop: "1px solid #f1f5f9", 
  margin: "6px 0" 
};

const notificationBadgeStyle: React.CSSProperties = { 
  position: "absolute", 
  top: "8px", 
  right: "8px", 
  width: "7px", 
  height: "7px", 
  backgroundColor: "#e11d48", 
  borderRadius: "50%", 
  border: "1.5px solid #ffffff" 
};

const flexCenterGap = (gap: number): React.CSSProperties => ({ 
  display: "flex", 
  alignItems: "center", 
  gap: `${gap}px` 
});

const textGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const mobileMenuButtonStyle: React.CSSProperties = { ...iconButtonStyle, backgroundColor: "#ffffff" };
const moreButtonStyle: React.CSSProperties = { ...iconButtonStyle, border: "none", background: "transparent" };