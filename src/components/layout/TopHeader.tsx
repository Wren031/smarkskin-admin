import React, { useMemo, useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, MoreVertical, User, Settings, LogOut } from "lucide-react";

// --- Types ---
interface TopHeaderProps {
  isDesktop: boolean;
  setMobileOpen: (value: boolean) => void;
  userName?: string;
}

export default function TopHeader({
  isDesktop,
  setMobileOpen,
  userName = "Admin",
}: TopHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <header style={{ 
      ...headerContainerStyle, 
      padding: isDesktop ? "0 32px" : "0 16px" 
    }}>
      {/* Left Section */}
      <div style={flexCenterGap(isDesktop ? 16 : 12)}>
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
            <h2 style={titleStyle}>Goodmorning, {userName}</h2>
            <time style={subtitleStyle}>{dateStr}</time>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div style={flexCenterGap(isDesktop ? 12 : 8)}>
        {isDesktop && (
          <div style={searchContainerStyle}>
            <Search size={18} style={{ color: "#9ca3af" }} />
            <span style={searchPlaceholderStyle}>Search...</span>
          </div>
        )}
        
        <button type="button" style={iconButtonStyle}>
          <div style={notificationBadgeStyle} />
          <Bell size={20} />
        </button>

        {/* --- Avatar / 3-Dots Menu Container --- */}
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

          {/* Dropdown Menu */}
          {showMenu && (
            <div style={dropdownStyle}>
              <div style={dropdownItemStyle}><User size={16} /> Profile</div>
              <div style={dropdownItemStyle}><Settings size={16} /> Settings</div>
              <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />
              <div style={{ ...dropdownItemStyle, color: "#ef4444" }}><LogOut size={16} /> Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// --- Styles ---

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "120%",
  right: 0,
  width: "160px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "1px solid #e2e8f0",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  zIndex: 100,
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  fontSize: "14px",
  color: "#475569",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.2s",
  // In a real app, use a CSS class for :hover
};

// ... (Rest of your previous styles remain the same)
const headerContainerStyle: React.CSSProperties = {
  height: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid #eceef2",
  position: "sticky",
  top: 0,
  zIndex: 30,
};

const titleStyle: React.CSSProperties = { margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#1a1c1e" };
const subtitleStyle: React.CSSProperties = { fontSize: "0.85rem", color: "#64748b" };
const iconButtonStyle: React.CSSProperties = { position: "relative", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", cursor: "pointer", color: "#475569", borderRadius: "10px", display: "flex", alignItems: "center" };
const mobileMenuButtonStyle: React.CSSProperties = { ...iconButtonStyle, backgroundColor: "#ffffff" };
const moreButtonStyle: React.CSSProperties = { ...iconButtonStyle, border: "none", background: "transparent" };
const avatarPlaceholderStyle: React.CSSProperties = { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#000000", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, cursor: "pointer" };
const searchContainerStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f1f5f9", padding: "8px 16px", borderRadius: "8px",width: "350px" };
const searchPlaceholderStyle: React.CSSProperties = { fontSize: "14px", color: "#9ca3af" };
const textGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const notificationBadgeStyle: React.CSSProperties = { position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid #ffffff" };
const flexCenterGap = (gap: number): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: `${gap}px` });