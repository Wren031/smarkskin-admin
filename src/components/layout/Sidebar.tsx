import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Package, Sparkles, FileText,
  Settings, User, Dna, UserRoundSearch, HeartPulse
} from "lucide-react";
import { admin_skin_result_service } from "../../features/scan/service/admin_skin_result_service";

interface MenuItem {
  to: string;
  label: string;
  icon: React.ElementType;
  section?: string;
  count?: number;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  user: { name: string; phone?: string };
  onLogout: () => void;
}

export default function Sidebar({ collapsed, setCollapsed, user}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [todayScanCount, setTodayScanCount] = useState<number>(0);
  const location = useLocation();
  
  const isExpanded = !collapsed || isHovered;
  const DIAGNOSTIC_ROUTE = "/admin/users-scan";

  useEffect(() => {
    const fetchCount = async () => {
      if (location.pathname !== DIAGNOSTIC_ROUTE) {
        try {
          const count = await admin_skin_result_service.getTodayScanCount();
          setTodayScanCount(count);
        } catch (error) {
          console.error("Failed to fetch scan count", error);
        }
      }
    };
    fetchCount();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === DIAGNOSTIC_ROUTE) {
      setTodayScanCount(0);
    }
  }, [location.pathname]);

  // --- RESPONSIVE AUTO-CLOSE LOGIC ---
  const handleItemClick = () => {
    // 1024px is usually the breakpoint where the sidebar becomes an overlay or mobile menu
    const isMobile = window.innerWidth < 1024; 
    
    if (isMobile) {
      setCollapsed(true); // Close the sidebar on mobile
      setIsHovered(false); // Reset hover state
    }
  };

  const MENU: MenuItem[] = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users, section: "Management" },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/recommendation", label: "Recommendations", icon: Sparkles, section: "Analysis" },
    { to: "/admin/condition", label: "Skin Analysis", icon: Dna },
    { 
        to: DIAGNOSTIC_ROUTE, 
        label: "Diagnostic History", 
        icon: UserRoundSearch, 
        count: todayScanCount
    },
    { to: "/admin/lifestyle", label: "Lifestyle Tips", icon: HeartPulse, section: "Content" },
    { to: "/admin/report", label: "Reports", icon: FileText },
    { to: "/admin/settings", label: "Settings", icon: Settings, section: "System" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col z-[1000] overflow-hidden transition-all duration-300 shadow-sm"
    >
      {/* Profile Section */}
      <div className="p-4 mb-2">
        <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${isExpanded ? 'bg-slate-50' : 'justify-center bg-transparent'}`}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-200 text-white">
            <User size={18} strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden whitespace-nowrap">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Administrator</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar">
        {MENU.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <React.Fragment key={item.to}>
              {item.section && isExpanded && (
                <div className="px-3 pt-6 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  {item.section}
                </div>
              )}

              <NavLink 
                to={item.to} 
                className="block group"
                onClick={handleItemClick} // Logic handles responsive closing
              >
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                  isActive ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                } ${!isExpanded && "justify-center"}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  
                  {isExpanded && (
                    <span className="text-sm font-semibold whitespace-nowrap flex-1">{item.label}</span>
                  )}

                  {/* Notification Badge */}
                  {item.count !== undefined && item.count > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`font-black transition-all ${
                      isExpanded 
                        ? "px-2 py-0.5 rounded-lg text-[10px]" 
                        : "absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] flex items-center justify-center border-2 border-white"
                    } ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                      {item.count}
                    </motion.div>
                  )}
                </div>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
      `}</style>
    </motion.aside>
  );
}