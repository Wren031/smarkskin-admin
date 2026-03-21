import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Sparkles,
  FileText,
  Settings,
  User,
} from "lucide-react";
import { ScanFace  } from "lucide-react";


type SidebarProps = {
  collapsed: boolean;
  user: {
    name: string;
    phone: string;
  };
  onLogout: () => void;
};

type MenuItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const iconSize = 20;

const MENU: MenuItem[] = [
  { to: "/dashboard", label: "DASHBOARD", icon: <LayoutDashboard size={iconSize} strokeWidth={1.8} /> },
  { to: "/users", label: "USERS", icon: <Users size={iconSize} strokeWidth={1.8} /> },
  { to: "/products", label: "PRODUCTS", icon: <Package  size={iconSize} strokeWidth={1.8} /> },
  { to: "/recommendation", label: "RECOMMENDATIONS", icon: <Sparkles  size={iconSize} strokeWidth={1.8}/>},
  { to: "/condition", label: "SKIN CONDITION", icon: <ScanFace   size={iconSize} strokeWidth={1.8}/>},
  { to: "/reports", label: "REPORT", icon: <FileText size={iconSize} strokeWidth={1.8} /> },
  { to: "/settings", label: "SETTINGS", icon: <Settings size={iconSize} strokeWidth={1.8} /> },
];

export default function Sidebar({ collapsed, user }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 88 : 260,
        height: "100vh",
        overflow: "hidden", // ✅ prevent sidebar scroll
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.25s ease",
      }}
    >
      <div>
        {/* User Profile */}
        <div
          style={{
            padding: collapsed ? "20px 12px" : "28px 20px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 16,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: collapsed ? 38 : 54,
                height: collapsed ? 38 : 54,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 4px #dedede",
              }}
            >
              <User size={30} strokeWidth={1} color="#000000" />
            </div>

            {!collapsed && (
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#111827",
                  }}
                >
                  {user.name.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    marginTop: 4,
                  }}
                >
                  {user.phone}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "16px 12px", marginTop: 20 }}>
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 14,
                padding: collapsed ? "12px" : "12px 18px",
                marginBottom: 8,
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 0.2s ease",
                color: isActive ? "#ffffff" : "#535353",
                backgroundColor: isActive ? "#000000" : "transparent",
              })}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

    </aside>
  );
}