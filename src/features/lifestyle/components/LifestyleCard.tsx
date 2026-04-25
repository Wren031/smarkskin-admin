import { useState, useRef, useEffect } from "react";
import { Lightbulb, Trash2, Tag, MoreVertical, Edit2, Calendar } from "lucide-react";
import type { LifestyleTip } from "../types/Lifestyle";
import type { CSSProperties } from "react";

interface Props {
  tip: LifestyleTip;
  onDelete: (id: string) => void;
  onEdit: (tip: LifestyleTip) => void;
}

export default function LifestyleCard({ tip, onDelete, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper to format category keys for display (e.g., sun_protection -> Sun Protection)
  const formatCategory = (cat: string) => 
    cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Professional color palette for your specific categories
  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    switch (cat) {
      case "diet": return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
      case "hydration": return { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" };
      case "sleep": return { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" };
      case "sun_protection": return { bg: "#fffbeb", text: "#b45309", border: "#fde68a" };
      case "hygiene": return { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" };
      case "skincare_habits": return { bg: "#fdf2f8", text: "#be185d", border: "#fbcfe8" };
      case "stress_management": return { bg: "#fff7ed", text: "#c2410c", border: "#ffedd5" };
      case "exercise": return { bg: "#f0fdfa", text: "#0f766e", border: "#ccfbf1" };
      default: return { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" };
    }
  };

  const catStyle = getCategoryStyles(tip.category);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = new Date(tip.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div style={styles.card} className="lifestyle-card">
      <style>{`
        .lifestyle-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .lifestyle-card:hover { 
          transform: translateY(-4px); 
          border-color: #cbd5e1 !important; 
          box-shadow: 0 12px 20px -5px rgba(0,0,0,0.06), 0 8px 8px -5px rgba(0,0,0,0.04) !important; 
        }
        .dropdown-item { transition: all 0.2s; border-radius: 6px; }
        .dropdown-item:hover { background-color: #f1f5f9 !important; color: #0f172a !important; }
        .action-dot:hover { background-color: #f1f5f9 !important; }
      `}</style>

      <div style={styles.header}>
        <div style={{
          ...styles.categoryBadge,
          backgroundColor: catStyle.bg,
          color: catStyle.text,
          borderColor: catStyle.border
        }}>
          <Tag size={10} strokeWidth={3} /> {formatCategory(tip.category)}
        </div>
        
        <div style={{ position: "relative" }} ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
            style={styles.actionBtn}
            className="action-dot"
          >
            <MoreVertical size={18} color="#94a3b8" />
          </button>

          {showMenu && (
            <div style={styles.dropdown}>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem} 
                onClick={(e) => { e.stopPropagation(); onEdit(tip); setShowMenu(false); }}
              >
                <Edit2 size={13} /> Update Entry
              </button>
              
              <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 6px' }} />
              
              <button 
                className="dropdown-item"
                style={{ ...styles.dropdownItem, color: "#ef4444" }} 
                onClick={(e) => { e.stopPropagation(); onDelete(tip.id); setShowMenu(false); }}
              >
                <Trash2 size={13} /> Delete Tip
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.body}>
        <h3 style={styles.title}>{tip.title}</h3>
        <p style={styles.desc}>{tip.description}</p>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <div style={styles.dotIndicator} />
          <span>Wellness Insight</span>
        </div>
        <div style={styles.footerItem}>
          <Calendar size={12} color="#94a3b8" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: { 
    background: "#ffffff", 
    padding: "24px", 
    borderRadius: "16px", 
    border: "1px solid #f1f5f9", 
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)", 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px",
    position: "relative",
    height: "100%",
    minHeight: "240px"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  categoryBadge: { 
    padding: "4px 10px", 
    borderRadius: "8px", 
    fontSize: "11px", 
    fontWeight: 700, 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    letterSpacing: "0.01em",
    border: "1px solid"
  },
  actionBtn: { 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    padding: "6px", 
    borderRadius: "8px",
    display: "flex",
    transition: "background 0.2s"
  },
  body: { display: "flex", flexDirection: "column", gap: "8px" },
  dropdown: { 
    position: "absolute", 
    top: "100%", 
    right: 0, 
    background: "#fff", 
    border: "1px solid #e2e8f0", 
    borderRadius: "10px", 
    boxShadow: "0 12px 24px -6px rgba(0,0,0,0.12)", 
    zIndex: 100,
    minWidth: "150px", 
    padding: "6px",
    marginTop: "8px"
  },
  dropdownItem: { 
    width: "100%", 
    padding: "10px 12px", 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    fontSize: "13px", 
    fontWeight: 500, 
    color: "#475569", 
    textAlign: "left"
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a", lineHeight: 1.4 },
  desc: { 
    fontSize: "14px", 
    color: "#64748b", 
    lineHeight: "1.6", 
    margin: 0,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  footer: { 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center", 
    marginTop: "auto", 
    paddingTop: "16px", 
    borderTop: "1px solid #f8fafc" 
  },
  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: 500
  },
  dotIndicator: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#eab308"
  }
};