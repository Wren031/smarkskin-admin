import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const DESKTOP_BREAKPOINT = 1024;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
      if (desktop) setMobileOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop && mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen, isDesktop]);

 
  return (
  <div
    style={{
      display: "flex",
      height: "100vh",        // ✅ lock height
      overflow: "hidden",     // ✅ prevent whole page scroll
      background: "#f9fafb",
    }}
  >
    {/* Desktop Sidebar */}
    {isDesktop && (
      <Sidebar
        collapsed={collapsed}
        user={{
          name: "Admin",
          phone: "+998 (99) 436-46-15",
        }}
        onLogout={() => console.log("Logout")}
      />
    )}

    {/* Mobile Sidebar (unchanged) */}
    {!isDesktop && (
      <>
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 40,
            }}
          />
        )}

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 50,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <Sidebar
            collapsed={false}
            user={{
              name: "Admin",
              phone: "+998 (99) 436-46-15",
            }}
            onLogout={() => console.log("Logout")}
          />
        </div>
      </>
    )}

    {/* RIGHT SIDE */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",      // ✅ important
        overflow: "hidden",   // ✅ prevent this container from scrolling
      }}
    >
      <TopHeader
        isDesktop={isDesktop}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setMobileOpen={setMobileOpen}
      />

      {/* ✅ ONLY THIS SCROLLS */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",  // ⭐ key fix
          padding: "24px",
          background: "#ffffff",
        }}
      >
        <Outlet />
      </main>
    </div>
  </div>
);
}