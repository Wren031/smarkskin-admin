import React from "react";
import { 
  X, 
  Stethoscope, 
  ShieldAlert, 
  Activity, 
  Package, 
  ChevronRight,
  ClipboardList,
  Sparkles,
  Clock,
  Info
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any | null; 
}

export default function ViewRecommendationDrawer({ isOpen, onClose, data }: Props) {
  if (!data) return null;

  // Format the creation date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-550px",
    width: "min(550px, 100vw)",
    height: "100vh",
    background: "#fff",
    boxShadow: "-10px 0 50px rgba(0,0,0,0.1)",
    transition: "right 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? "auto" : "none",
    transition: "opacity 0.3s ease",
    zIndex: 1000,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      
      <div style={drawerStyle}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Stethoscope size={22} color="#3b82f6" />
            </div>
            <div>
              <h2 style={styles.title}>{data.condition?.name || "Protocol Details"}</h2>
              <div style={styles.metaRow}>
                <span style={styles.subtitle}>ID: {data.id}</span>
                <span style={styles.dot}>•</span>
                <span style={styles.subtitle}><Clock size={10} /> {formatDate(data.createdAt)}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><X size={16} /></button>
        </header>

        {/* CONTENT */}
        <div style={styles.content}>
          
          {/* Summary Row */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>SEVERITY LEVEL</span>
              <span style={{...styles.statValue, color: data.severity === 'Severe' ? '#ef4444' : '#3b82f6'}}>
                {data.severity}
              </span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>PROTOCOL TYPE</span>
              <span style={styles.statValue}>Condition Specific</span>
            </div>
          </div>

          {/* Clinical Treatment */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <ClipboardList size={14} /> <span>Primary Treatment Protocol</span>
            </div>
            <div style={styles.protocolCard}>
              {data.treatment}
            </div>
          </section>

          {/* Safety Precautions */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <ShieldAlert size={14} color="#ef4444" /> <span style={{color: '#ef4444'}}>Safety & Precautions</span>
            </div>
            <div style={styles.precautionCard}>
              {data.precautions || "Standard clinical monitoring recommended."}
            </div>
          </section>

          {/* Lifestyle Tips */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <Activity size={14} /> <span>Lifestyle Recommendations</span>
            </div>
            <div style={styles.tipsGrid}>
              {data.lifestyleTips?.length > 0 ? (
                data.lifestyleTips.map((tip: any) => (
                  <div key={tip.id} style={styles.tipItem}>
                    <div style={styles.tipIcon}><Sparkles size={12} color="#3b82f6" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.tipCategory}>{tip.category}</div>
                      <div style={styles.tipTitle}>{tip.title}</div>
                      <p style={styles.tipDescription}>{tip.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>No lifestyle tips linked to this protocol.</div>
              )}
            </div>
          </section>

          {/* Product Adjuncts */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <Package size={14} /> <span>Recommended Product Adjuncts</span>
            </div>
            <div style={styles.productList}>
              {data.products?.length > 0 ? (
                data.products.map((p: any) => (
                  <div key={p.id} style={styles.productCard}>
                    <div style={styles.productMain}>
                      <img src={p.image_url} alt="" style={styles.productImg} />
                      <div style={{ flex: 1 }}>
                        <div style={styles.pName}>{p.product_name}</div>
                        <div style={styles.pType}>{p.type} • PHP {p.price}</div>
                      </div>
                    </div>
                    <div style={styles.productDetails}>
                      <div style={styles.detailTag}><strong>Usage:</strong> {p.usage}</div>
                      <div style={styles.detailText}>{p.instructions}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>No products assigned to this protocol.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { padding: "32px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  badge: { width: 48, height: 48, borderRadius: 14, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
  metaRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 },
  subtitle: { fontSize: 11, color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
  dot: { color: "#cbd5e1" },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b" },
  content: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32 },
  statsRow: { display: "flex", gap: 12 },
  statBox: { flex: 1, padding: "16px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 4 },
  statLabel: { fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.5px" },
  statValue: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  section: { display: "flex", flexDirection: "column", gap: 14 },
  secHead: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" },
  protocolCard: { padding: "20px", borderRadius: "16px", background: "#fff", border: "1px solid #f1f5f9", fontSize: "14px", lineHeight: "1.6", color: "#475569" },
  precautionCard: { padding: "20px", borderRadius: "16px", background: "#fff5f5", border: "1px solid #fee2e2", borderLeft: "4px solid #ef4444", fontSize: "14px", lineHeight: "1.6", color: "#991b1b" },
  tipsGrid: { display: "flex", flexDirection: "column", gap: 12 },
  tipItem: { display: "flex", gap: 14, padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9", background: "#fff" },
  tipIcon: { width: 28, height: 28, borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  tipCategory: { fontSize: 10, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", marginBottom: 4 },
  tipTitle: { fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 6 },
  tipDescription: { fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 },
  productList: { display: "flex", flexDirection: "column", gap: 12 },
  productCard: { display: "flex", flexDirection: "column", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" },
  productMain: { display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "#fff" },
  productImg: { width: 48, height: 48, borderRadius: 10, objectFit: "cover", background: "#f8fafc" },
  pName: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  pType: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  productDetails: { padding: "14px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9" },
  detailTag: { fontSize: 11, color: "#475569", marginBottom: 6 },
  detailText: { fontSize: 12, color: "#64748b", lineHeight: 1.5 },
  emptyState: { padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "13px", border: "1px dashed #e2e8f0", borderRadius: "16px" }
};