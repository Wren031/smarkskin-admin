import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const DESKTOP_BREAKPOINT = 1024;

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  const handleLogout = () => {
    navigate("/", { replace: true });
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
        setCollapsed(true); 
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userData = { name: "Admin", phone: "+998 (99) 436-46-15" };

  return (
    <div style={layoutStyles.container}>
      {/* Global Transition Styles */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        .main-content {
          transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      
      {/* Sidebar Logic */}
      {isDesktop ? (
        <div style={{ 
          width: collapsed ? "80px" : "280px", 
          transition: "width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          borderRight: "1px solid #f1f5f9"
        }}>
          <Sidebar
            collapsed={collapsed}
            user={userData}
            onLogout={handleLogout}
          />
        </div>
      ) : (
        <>
          {/* Mobile Overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              ...layoutStyles.overlay,
              opacity: mobileOpen ? 1 : 0,
              visibility: mobileOpen ? "visible" : "hidden",
            }}
          />
          <div
            style={{
              ...layoutStyles.mobileSidebarWrapper,
              transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <Sidebar
              collapsed={false} 
              user={userData}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div style={layoutStyles.mainArea}>
        <TopHeader
          isDesktop={isDesktop}
          setMobileOpen={setMobileOpen}
          userName={userData.name}
          // Optional: Pass toggle for desktop sidebar if TopHeader has a burger icon
          onToggleSidebar={() => setCollapsed(!collapsed)} 
        />

        <main className="main-content" style={layoutStyles.scrollArea}>
          <div style={layoutStyles.contentContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

const layoutStyles: Record<string, CSSProperties> = {
  container: { 
    display: "flex", 
    height: "100vh", 
    overflow: "hidden", 
    backgroundColor: "#ffffff", // Pure white for a high-end feel
    fontFamily: "'Inter', system-ui, sans-serif" 
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
    backdropFilter: "blur(8px)", // Modern 2026 glass effect
    zIndex: 40,
    transition: "all 0.4s ease",
  },
  mobileSidebarWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 50,
    boxShadow: "20px 0 50px rgba(0,0,0,0.05)",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  mainArea: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    minWidth: 0,
    position: "relative"
  },
  scrollArea: { 
    flex: 1, 
    overflowY: "auto", 
    overflowX: "hidden",
    backgroundColor: "#fff" // Changed to pure white to match your modern card aesthetic
  },
  contentContainer: { 
    margin: "0 auto", 
    // padding: "clamp(16px, 3vw, 40px)", // Responsive padding
    // maxWidth: "1600px" // Prevents the content from getting too wide on ultra-wide monitors
  }
};