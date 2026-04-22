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
  UserRoundSearch,
} from "lucide-react";

type MenuItem = { to: string; label: string; icon: React.ElementType };
type SidebarProps = {
  collapsed: boolean;
  user: { name: string; phone: string };
  onLogout: () => void;
};

const MENU: MenuItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/recommendation", label: "Recommendations", icon: Sparkles },
  { to: "/admin/condition", label: "Skin Condition", icon: ScanFace },
  { to: "/admin/users-scan", label: "Users Scan", icon: UserRoundSearch },
  { to: "/admin/report", label: "Reports", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
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
        borderRight: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      {/* Brand / Profile Area */}
      <div style={{ padding: isExpanded ? "32px 24px" : "32px 0", transition: "0.3s" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isExpanded ? "flex-start" : "center", 
          gap: 16 
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, 
            backgroundColor: "#0f172a", // Dark professional background
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)"
          }}>
            <User size={22} color="#ffffff" />
          </div>
          {isExpanded && (
            <div style={{ whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{user.phone}</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ 
        flex: 1, 
        padding: isExpanded ? "0 16px" : "0 12px", 
        display: "flex",
        flexDirection: "column",
        gap: "4px"
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
                padding: "12px",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: isActive ? "#0f172a" : isHoveredItem ? "#f8fafc" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    color={isActive ? "#ffffff" : isHoveredItem ? "#0f172a" : "#64748b"}
                    strokeWidth={isActive ? 2.2 : 1.8} 
                    style={{ flexShrink: 0, transition: "0.2s" }} 
                  />
                  {isExpanded && (
                    <span style={{ 
                      marginLeft: 14,
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#ffffff" : isHoveredItem ? "#0f172a" : "#64748b",
                      whiteSpace: "nowrap",
                      transition: "0.2s"
                    }}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div style={{ 
        padding: "24px 16px", 
        borderTop: "1px solid #f1f5f9" 
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
            padding: "12px", 
            border: "none", 
            cursor: "pointer", 
            borderRadius: "12px", 
            transition: "0.2s", 
            backgroundColor: hoveredPath === "logout" ? "#fff1f2" : "transparent",
          }}
        >
          <LogOut size={20} color="#e11d48" style={{ flexShrink: 0 }} />
          {isExpanded && (
            <span style={{ 
              marginLeft: 14, 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#e11d48",
              whiteSpace: "nowrap" 
            }}>
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}