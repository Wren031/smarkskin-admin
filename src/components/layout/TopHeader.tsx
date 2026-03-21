import { useEffect, useState } from "react";

type TopHeaderProps = {
  isDesktop: boolean;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
  userName?: string;
};

export default function TopHeader({
  isDesktop,
  collapsed,
  setCollapsed,
  setMobileOpen,
  userName = "Admin",
}: TopHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load saved theme (or system preference)
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // ✅ Apply + save theme globally
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header
      className="header"
      style={{
        height: 70,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: darkMode
          ? "rgba(17, 24, 39, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: darkMode
          ? "1px solid #374151"
          : "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s ease", // ✅ smooth
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() =>
            isDesktop
              ? setCollapsed(!collapsed)
              : setMobileOpen(true)
          }
          aria-label="Toggle Navigation"
          style={{
            height: 40,
            width: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            borderRadius: 8,
            border: "none",
            background: darkMode ? "#1f2937" : "#ffffff",
            color: darkMode ? "#fff" : "#000",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {isDesktop ? (collapsed ? "›" : "‹") : "☰"}
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "color 0.3s ease",
          }}
        >
          Good morning, {userName}
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        
        {/* 🌙 DARK MODE BUTTON */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            background: darkMode ? "#374151" : "#e5e7eb",
            color: darkMode ? "#fff" : "#000",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* LOGOUT */}
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: 15,
            fontWeight: 500,
            color: darkMode ? "#f87171" : "#7e0000",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: 6,
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            console.log("Logout clicked");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}