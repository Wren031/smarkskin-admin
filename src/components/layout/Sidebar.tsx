import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Sparkles,
  FileText,
  Settings,
  User,
  ScanFace,
  LogOut,
} from "lucide-react";

type MenuItem = {
  to: string;
  label: string;
  icon: React.ElementType;
};

type SidebarProps = {
  collapsed: boolean;
  user: {
    name: string;
    phone: string;
  };
  onLogout: () => void;
};

const MENU: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/recommendation", label: "Recommendations", icon: Sparkles },
  { to: "/condition", label: "Skin Condition", icon: ScanFace },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, user, onLogout }: SidebarProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  const isExpanded = !collapsed || isHoveringSidebar;

  return (
    <aside
      onMouseEnter={() => setIsHoveringSidebar(true)}
      onMouseLeave={() => setIsHoveringSidebar(false)}
      style={{
        width: isExpanded ? 280 : 80,
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Profile Section */}
      <div style={{ 
        padding: isExpanded ? "20px 14px" : "24px 0", 
        justifyContent: "center"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isExpanded ? "flex-start" : "center", 
          gap: 12,
          width: isExpanded ? "100%" : "auto"
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, backgroundColor: "#f9fafb",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #e5e7eb"
          }}>
            <User size={20} color="#111827" />
          </div>
          <div style={{ 
            opacity: isExpanded ? 1 : 0, 
            width: isExpanded ? "auto" : 0, // Shrink width to 0 to prevent ghost spacing
            transition: "opacity 0.2s ease, width 0.2s ease",
            visibility: isExpanded ? "visible" : "hidden",
            whiteSpace: "nowrap" 
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{user.phone}</div>
          </div>
        </div>
      </div>

      <nav style={{ 
        flex: 1, 
        padding: isExpanded ? "0 12px" : "0 8px", 
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center" // Ensures items stack centrally
      }}>
        {MENU.map((item) => {
          const Icon = item.icon;
          const isHoveredItem = hoveredPath === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredPath(item.to)}
              onMouseLeave={() => setHoveredPath(null)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: isExpanded ? "flex-start" : "center",
                gap: isExpanded ? 12 : 0, // No gap when collapsed to keep icon centered
                padding: "12px",
                width: "100%", // Ensures the background color fills the hover area
                boxSizing: "border-box",
                marginBottom: 4,
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
                color: isActive ? "#ffffff" : isHoveredItem ? "#ffffff" : "#6b7280",
                backgroundColor: isActive ? "#000000" : isHoveredItem ? "#000000" : "transparent",
              })}
            >
              <Icon size={20} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{ 
                opacity: isExpanded ? 1 : 0, 
                width: isExpanded ? "auto" : 0,
                overflow: "hidden",
                transition: "opacity 0.2s ease, width 0.2s ease",
                visibility: isExpanded ? "visible" : "hidden",
                whiteSpace: "nowrap"
              }}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ 
        padding: isExpanded ? "16px 12px" : "16px 8px", 
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        justifyContent: "center"
      }}>
        <button
          onClick={onLogout}
          onMouseEnter={() => setHoveredPath("logout")}
          onMouseLeave={() => setHoveredPath(null)}
          style={{
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isExpanded ? "flex-start" : "center",
            gap: isExpanded ? 12 : 0, 
            padding: "12px", 
            border: "none", 
            cursor: "pointer", 
            borderRadius: 8, 
            fontSize: 14, 
            fontWeight: 500,
            transition: "all 0.2s", 
            color: "#dc2626",
            backgroundColor: hoveredPath === "logout" ? "#fee2e2" : "transparent",
          }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          <span style={{ 
            opacity: isExpanded ? 1 : 0, 
            width: isExpanded ? "auto" : 0,
            overflow: "hidden",
            transition: "opacity 0.2s ease, width 0.2s ease",
            visibility: isExpanded ? "visible" : "hidden",
            whiteSpace: "nowrap"
          }}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}