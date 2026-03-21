import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const DESKTOP_BREAKPOINT = 1024;

export default function DashboardLayout() {
  // Set to true so it starts closed and only opens via the hover logic in Sidebar.tsx
  const [collapsed, setCollapsed] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
        setCollapsed(true); // Ensure it stays in "hover-mode" on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userData = { name: "Admin", phone: "+998 (99) 436-46-15" };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f9fafb" }}>
      {/* Desktop Sidebar */}
      {isDesktop && (
        <Sidebar
          collapsed={collapsed}
          user={userData}
          onLogout={() => console.log("Logout")}
        />
      )}

      {/* Mobile Sidebar & Overlay */}
      {!isDesktop && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(4px)",
              opacity: mobileOpen ? 1 : 0,
              visibility: mobileOpen ? "visible" : "hidden",
              zIndex: 40,
              transition: "all 0.3s ease",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              zIndex: 50,
              transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Sidebar
              collapsed={false} // Mobile sidebar is usually full-width/expanded
              user={userData}
              onLogout={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopHeader
          isDesktop={isDesktop}
          setMobileOpen={setMobileOpen}
          userName={userData.name}
        />

        <main
          style={{
            flex: 1,
            overflowY: "auto",

          }}
        >
          <div style={{ margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}