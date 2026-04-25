import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { 
  FaExclamationTriangle, 
  FaStethoscope, 
  FaEllipsisV, 
  FaEye, 
  FaRegEdit, 
  FaRegTrashAlt,
  FaCapsules,
  FaWalking 
} from "react-icons/fa";

/* ── HELPER COMPONENTS ── */
const Skeleton = ({ width, height, borderRadius = "12px" }: any) => (
  <div className="shimmer" style={{ width, height, borderRadius, background: "#f3f4f6" }} />
);

export default function RecommendationCards({ recommendation, onDelete, onView, onEdit, loading }: any) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null); // New state for hover
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

  const getSeverityStyle = (severity: string): CSSProperties => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return { background: "#1e293b", color: "#f8fafc", border: "1px solid #0f172a" };
      case "moderate":
        return { background: "#fff7ed", color: "#9a3412", border: "1px solid #ffedd5" };
      case "mild":
        return { background: "#f0fdf4", color: "#166534", border: "1px solid #dcfce7" };
      default:
        return { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" };
    }
  };

  if (loading) {
    return (
      <div style={cardStyles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={cardStyles.card}><Skeleton width="100%" height="380px" /></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        .modern-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .modern-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05) !important; }
        .action-btn { transition: background 0.2s; }
        .action-btn:hover { background-color: #f8fafc !important; }
        .product-item { transition: border-color 0.2s; }
        .product-item:hover { border-color: #3b82f6 !important; }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .shimmer { animation: shimmer 1.5s infinite; }
        .tooltip-fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={cardStyles.grid}>
        {recommendation.map((rec: any) => (
          <div key={rec.id} className="modern-card" style={cardStyles.card}>
            {/* ── HEADER ── */}
            <div style={cardStyles.cardHeader}>
              <div style={cardStyles.headerLeft}>
                <div style={cardStyles.iconCircle}>
                  <FaStethoscope size={20} />
                </div>
                <div>
                  <h3 style={cardStyles.conditionTitle}>{rec.condition?.name || "Unknown Condition"}</h3>
                  <span style={cardStyles.idText}>Protocol ID • {rec.id}</span>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <button 
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
                      <FaRegEdit size={14} /> Edit Entry
                    </div>
                    <div style={cardStyles.divider} />
                    <div className="action-btn" style={{ ...cardStyles.dropdownItem, color: '#dc2626' }} onClick={() => { onDelete(rec.id); setActiveMenu(null); }}>
                      <FaRegTrashAlt size={14} /> Delete
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── BODY ── */}
            <div style={cardStyles.body}>
              <div style={cardStyles.severityRow}>
                <span style={{ ...cardStyles.pill, ...getSeverityStyle(rec.severity) }}>
                  {rec.severity}
                </span>
              </div>
              
              <p style={cardStyles.description}>
                {rec.treatment || "No specific treatment steps provided for this case."}
              </p>

              <div style={cardStyles.precautionNote}>
                <FaExclamationTriangle size={12} color="#94a3b8" />
                <span style={cardStyles.precautionText}>{rec.precautions || "Standard clinical precautions apply."}</span>
              </div>
            </div>

            {/* ── FOOTER: PRODUCTS ── */}
            <div style={cardStyles.footer}>
              <div style={cardStyles.subLabel}>
                <FaCapsules size={10} /> Formulated Adjuncts
              </div>
              <div style={cardStyles.productList}>
                {rec.products?.slice(0, 2).map((p: any) => (
                  <div key={p.id} className="product-item" style={cardStyles.productCard}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.product_name} style={cardStyles.productImg} />
                    ) : (
                      <div style={cardStyles.productImgPlaceholder}>
                        <FaCapsules size={10} color="#cbd5e1" />
                      </div>
                    )}
                    <div style={cardStyles.productMeta}>
                      <span style={cardStyles.productName}>{p.product_name}</span>
                      <span style={cardStyles.productType}>{p.type || 'Treatment'}</span>
                    </div>
                  </div>
                ))}
                
                {/* ── MORE PRODUCTS HOVER ── */}
                {rec.products?.length > 2 && (
                  <div 
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredBadge(rec.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div style={cardStyles.moreBadge}>
                      +{rec.products.length - 2}
                    </div>

                    {hoveredBadge === rec.id && (
                      <div className="tooltip-fade-in" style={cardStyles.productTooltip}>
                        <div style={{...cardStyles.subLabel, marginBottom: '8px', color: '#fff'}}>Additional Items</div>
                        {rec.products.slice(2).map((p: any) => (
                          <div key={p.id} style={cardStyles.tooltipItem}>
                             <span style={{color: '#3b82f6'}}>•</span> {p.product_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 🌿 LIFESTYLE TIPS (At the very bottom) */}
            {rec.lifestyleTips && rec.lifestyleTips.length > 0 && (
              <div style={cardStyles.lifestyleSectionBottom}>
                <div style={cardStyles.subLabel}>
                  <FaWalking size={10} /> Lifestyle Guidance
                </div>
                <div style={cardStyles.tipContainer}>
                  {rec.lifestyleTips.slice(0, 3).map((tip: any) => (
                    <span key={tip.id} style={cardStyles.tipTag}>
                      {tip.title}
                    </span>
                  ))}
                  {rec.lifestyleTips.length > 3 && (
                    <span style={cardStyles.moreTips}>+{rec.lifestyleTips.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const cardStyles: Record<string, CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "24px",
    padding: "32px",
    background: "#ffffff"
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    height: "100%",
    position: "relative"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  headerLeft: { display: "flex", gap: "14px", alignItems: "center" },
  iconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f0f7ff",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  conditionTitle: { margin: 0, fontSize: "16px", fontWeight: 600, color: "#1e293b" },
  idText: { fontSize: "11px", color: "#94a3b8", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em' },
  menuTrigger: { border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#cbd5e1' },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '32px',
    zIndex: 50,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    minWidth: '170px',
    padding: '4px',
    border: '1px solid #e2e8f0'
  },
  dropdownItem: {
    padding: '10px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#475569',
    fontWeight: 500
  },
  divider: { height: '1px', background: '#f1f5f9', margin: '4px 0' },
  body: { display: "flex", flexDirection: "column", gap: "16px", flex: 1 },
  severityRow: { display: "flex" },
  pill: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "6px",
    letterSpacing: "0.05em"
  },
  description: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#475569",
    maxHeight: "45px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical"
  },
  lifestyleSectionBottom: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "8px",
    paddingTop: "12px",
    borderTop: "1px dashed #f1f5f9"
  },
  subLabel: { 
    fontSize: "10px", 
    fontWeight: 700, 
    color: "#94a3b8", 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  tipContainer: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tipTag: {
    fontSize: "11px",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    color: "#475569",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: 500
  },
  moreTips: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 },
  precautionNote: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    background: "#fdf2f2",
    borderRadius: "10px",
    border: "1px solid #fee2e2"
  },
  precautionText: { fontSize: "12px", color: "#991b1b", fontWeight: 400 },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9"
  },
  productList: { display: "flex", alignItems: "center", gap: "10px" },
  productCard: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px",
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: "10px",
    flex: 1,
    minWidth: 0
  },
  productImg: { width: "34px", height: "34px", borderRadius: "6px", objectFit: "cover" },
  productImgPlaceholder: { width: "34px", height: "34px", borderRadius: "6px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" },
  productMeta: { display: "flex", flexDirection: "column", minWidth: 0 },
  productName: { fontSize: "12px", fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  productType: { fontSize: "10px", color: "#94a3b8" },
  moreBadge: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "#64748b",
    cursor: "help"
  },
  // New Styles for the hover tooltip
  productTooltip: {
    position: 'absolute',
    bottom: '45px',
    right: '0',
    background: '#1e293b',
    color: '#f8fafc',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    minWidth: '200px',
    border: '1px solid #334155'
  },
  tooltipItem: {
    fontSize: '12px',
    padding: '4px 0',
    borderBottom: '1px solid #334155',
    whiteSpace: 'nowrap'
  }
};