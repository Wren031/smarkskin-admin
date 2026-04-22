import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { FaExclamationTriangle, FaStethoscope, FaEllipsisV, FaEye, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const Skeleton = ({ width, height, borderRadius = "12px", style = {} }: any) => (
  <div className="shimmer" style={{ width, height, borderRadius, background: "#f3f4f6", ...style }} />
);

export default function RecommendationCards({ recommendation, onDelete, onView, onEdit, loading }: any) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper function for Dynamic Severity Styling
  const getSeverityStyle = (severity: string): CSSProperties => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return { background: "#000000", color: "#ffffff" }; // High contrast / Urgent
      case "moderate":
        return { background: "#fff7ed", color: "#c2410c" }; // Amber/Orange
      case "mild":
        return { background: "#eff6ff", color: "#2563eb" }; // Professional Blue
      default:
        return { background: "#f1f5f9", color: "#475569" }; // Default Neutral
    }
  };

  if (loading) {
    return (
      <div style={cardStyles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={cardStyles.card}><Skeleton width="100%" height="280px" /></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        .modern-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
        }
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12) !important;
        }
        .action-btn { transition: all 0.2s ease; }
        .action-btn:hover { background-color: #2563eb !important; color: white !important; }
        .dot-btn:hover { background: #f8fafc; border-radius: 50%; }
      `}</style>

      <div style={cardStyles.grid}>
        {recommendation.map((rec: any) => (
          <div key={rec.id} className="modern-card" style={cardStyles.card}>
            <div style={cardStyles.cardHeader}>
              <div style={cardStyles.headerLeft}>
                <div style={cardStyles.iconCircle}>
                  <FaStethoscope />
                </div>
                <div>
                  <h3 style={cardStyles.conditionTitle}>{rec.condition?.name}</h3>
                  <span style={cardStyles.idText}>Case #{rec.id}</span>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <button 
                  className="dot-btn"
                  style={cardStyles.menuTrigger} 
                  onClick={() => setActiveMenu(activeMenu === rec.id ? null : rec.id)}
                >
                  <FaEllipsisV />
                </button>

                {activeMenu === rec.id && (
                  <div ref={menuRef} style={cardStyles.dropdown}>
                    <div className="action-btn" style={cardStyles.dropdownItem} onClick={() => { onView(rec); setActiveMenu(null); }}>
                      <FaEye size={14} /> View Details
                    </div>
                    <div className="action-btn" style={cardStyles.dropdownItem} onClick={() => { onEdit(rec); setActiveMenu(null); }}>
                      <FaRegEdit size={14} /> Edit
                    </div>
                    <div className="action-btn" style={{ ...cardStyles.dropdownItem, color: '#ef4444' }} onClick={() => { onDelete(rec.id); setActiveMenu(null); }}>
                      <FaRegTrashAlt size={14} /> Delete
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={cardStyles.body}>
              <div style={cardStyles.severityRow}>
                {/* DYNAMIC PILL STYLE APPLIED HERE */}
                <span style={{ ...cardStyles.pill, ...getSeverityStyle(rec.severity) }}>
                  {rec.severity}
                </span>
              </div>
              
              <p style={cardStyles.description}>
                {rec.treatment || "Consult physician for treatment protocol."}
              </p>

              <div style={cardStyles.precautionNote}>
                <FaExclamationTriangle size={12} color="#64748b" />
                <span style={cardStyles.precautionText}>{rec.precautions || "Standard safety protocols."}</span>
              </div>
            </div>

            <div style={cardStyles.footer}>
              {rec.products?.slice(0, 3).map((p: any) => (
                <div key={p.id} style={cardStyles.miniTag}>
                   {p.product_name}
                </div>
              ))}
              {rec.products?.length > 3 && <span style={cardStyles.moreText}>+{rec.products.length - 3} more</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const cardStyles: Record<string, CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "32px",
    padding: "40px 20px",
    background: "#fdfdfd"
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
    position: "relative"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  headerLeft: { display: "flex", gap: "12px", alignItems: "center" },
  iconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "#f0f7ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  },
  conditionTitle: { margin: 0, fontSize: "17px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" },
  idText: { fontSize: "12px", color: "#94a3b8", fontWeight: 500 },
  menuTrigger: { border: 'none', background: 'none', cursor: 'pointer', padding: '8px', color: '#cbd5e1' },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '40px',
    zIndex: 50,
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    minWidth: '150px',
    padding: '6px',
    border: '1px solid #f1f5f9'
  },
  dropdownItem: {
    padding: '10px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#475569',
    fontWeight: 500
  },
  body: { display: "flex", flexDirection: "column", gap: "16px" },
  severityRow: { display: "flex" },
  pill: {
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    padding: "5px 12px",
    borderRadius: "8px",
    letterSpacing: "0.08em"
  },
  description: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#475569",
    height: "65px",
    overflow: "hidden"
  },
  precautionNote: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "14px"
  },
  precautionText: { fontSize: "12px", color: "#64748b", fontWeight: 500 },
  footer: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "16px",
    borderTop: "1px solid #f8fafc"
  },
  miniTag: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#475569",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "4px 10px",
    borderRadius: "8px"
  },
  moreText: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 }
};