import { 
  X, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  Package, 
  Calendar,
  ExternalLink
} from "lucide-react";
import type { CSSProperties } from "react";

import type { Recommendation } from "../types/Recommendation";

interface ViewDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: Recommendation | null;
}

export default function RecommendationDetailModal({ isOpen, onClose, data }: ViewDetailsProps) {
  if (!isOpen || !data) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .drawer-content { animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
      `}</style>

      <div 
        className="drawer-content" 
        style={modalStyles.drawer} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.headerTitle}>
            <div style={modalStyles.iconBox}><FileText size={20} /></div>
            <div>
              <h2 style={modalStyles.title}>Protocol Details</h2>
              <p style={modalStyles.subtitle}>Internal Reference: ID-{data.id}</p>
            </div>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}><X size={20} /></button>
        </div>

        {/* Content Area */}
        <div style={modalStyles.scrollArea}>
          
          {/* Status Ribbon */}
          <div style={{ ...modalStyles.statusRibbon, ...getSeverityStyle(data.severity) }}>
            <div style={modalStyles.flexCenter}>
              <Stethoscope size={14} />
              <span>Classification: <strong>{data.severity} {data.condition?.name}</strong></span>
            </div>
            <span style={modalStyles.dateStamp}>
              <Calendar size={12} /> {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Section: Clinical Treatment */}
          <section style={modalStyles.section}>
            <h4 style={modalStyles.sectionLabel}>Treatment Protocol</h4>
            <div style={modalStyles.textCard}>
              {data.treatment}
            </div>
          </section>

          {/* Section: Safety */}
          <section style={modalStyles.section}>
            <h4 style={modalStyles.sectionLabel}>Safety & Contraindications</h4>
            <div style={{ ...modalStyles.textCard, borderLeft: "4px solid #ef4444", backgroundColor: "#fef2f2" }}>
              <div style={{ display: 'flex', gap: '10px', color: '#b91c1c' }}>
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{data.precautions}</span>
              </div>
            </div>
          </section>

          {/* Section: Products */}
          <section style={modalStyles.section}>
            <h4 style={modalStyles.sectionLabel}>Prescribed Formulations</h4>
            <div style={modalStyles.productGrid}>
              {data.products?.map((product) => (
                <div key={product.id} style={modalStyles.productItem}>
                  {/* Product Image */}
                  <div style={modalStyles.imageWrapper}>
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.product_name} 
                        style={modalStyles.productImage} 
                      />
                    ) : (
                      <Package size={20} style={{ color: "#cbd5e1" }} />
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ flex: 1 }}>
                    <div style={modalStyles.pName}>{product.product_name}</div>
                    <div style={modalStyles.pBrand}>
                      {product.brand ? product.brand.toUpperCase() : "PHARMACEUTICAL GRADE"}
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div style={modalStyles.pPrice}>₱{product.price}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div style={modalStyles.footer}>
          <button style={modalStyles.secondaryBtn} onClick={onClose}>Close Preview</button>
          <button style={modalStyles.primaryBtn}>
            <ExternalLink size={14} /> Export Protocol
          </button>
        </div>
      </div>
    </div>
  );
}

const getSeverityStyle = (s: string) => {
  const styles: Record<string, any> = {
    Severe: { color: "#fff", background: "#0f172a" },
    Moderate: { color: "#1e293b", background: "#f1f5f9" },
    Mild: { color: "#2563eb", background: "#eff6ff" }
  };
  return styles[s] || styles.Mild;
};

const modalStyles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end"
  },
  drawer: {
    width: "100%",
    maxWidth: "550px",
    backgroundColor: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 50px rgba(0,0,0,0.1)"
  },
  header: {
    padding: "32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: { 
    width: "44px", height: "44px", borderRadius: "12px", 
    backgroundColor: "#f8fafc", color: "#0f172a", 
    display: "flex", alignItems: "center", justifyContent: "center" 
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginTop: "4px" },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "32px" },
  statusRibbon: { 
    padding: "16px", borderRadius: "14px", display: "flex", 
    justifyContent: "space-between", alignItems: "center", marginBottom: "32px",
    fontSize: "13px"
  },
  flexCenter: { display: "flex", alignItems: "center", gap: "10px" },
  dateStamp: { display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 },
  section: { marginBottom: "32px" },
  sectionLabel: { fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" },
  textCard: { 
    padding: "20px", borderRadius: "14px", backgroundColor: "#f8fafc", 
    border: "1px solid #f1f5f9", fontSize: "14px", lineHeight: "1.7", color: "#334155" 
  },
  productGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  productItem: { 
    display: "flex", alignItems: "center", gap: "16px", padding: "12px", 
    borderRadius: "16px", border: "1px solid #f1f5f9", backgroundColor: "#fff"
  },
  imageWrapper: {
    width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#f8fafc",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", border: "1px solid #f1f5f9", flexShrink: 0
  },
  productImage: { width: "100%", height: "100%", objectFit: "cover" },
  pName: { fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "2px" },
  pBrand: { fontSize: "10px", color: "#3b82f6", fontWeight: 800, letterSpacing: "0.5px" },
  pPrice: { fontSize: "15px", fontWeight: 800, color: "#0f172a", fontFamily: "monospace" },
  footer: { 
    padding: "32px", borderTop: "1px solid #f1f5f9", 
    display: "flex", gap: "16px", backgroundColor: "#fff" 
  },
  primaryBtn: { 
    flex: 2, background: "#0f172a", color: "#fff", border: "none", 
    height: "48px", borderRadius: "12px", fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
  },
  secondaryBtn: { 
    flex: 1, background: "transparent", border: "1px solid #e2e8f0", 
    height: "48px", borderRadius: "12px", fontWeight: 600, color: "#64748b", cursor: "pointer" 
  }
};