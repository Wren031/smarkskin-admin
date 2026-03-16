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
  return (
    <header
      style={{
        height: 70,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
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
            background: "#ffffff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "#e5e7eb")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "#ffffff")
          }
        >
          {isDesktop ? (collapsed ? "›" : "‹") : "☰"}
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "#111827",
            letterSpacing: "-0.3px",
          }}
        >
          Good morning, {userName}
        </h2>
      </div>

      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: 15,
          fontWeight: 500,
          color: "#7e0000",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: 6,
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "#fee2e2")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
        onClick={() => {
          console.log("Logout clicked");
        }}
      >
        Logout
      </button>
    </header>
  );
}