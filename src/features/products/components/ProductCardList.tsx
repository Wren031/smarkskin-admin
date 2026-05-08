import { useState } from "react";
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  Tag 
} from "lucide-react";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";

type Props = {
  products: Products[];
  onDelete?: (id: string) => void;
  onUpdate?: (product: Products) => void;
  loading?: boolean;
};

export default function ProductCardList({ products, onDelete, onUpdate, loading }: Props) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PH", { 
      month: "short", 
      day: "numeric"
    });
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  // --- SKELETON LOADING STATE ---
  if (loading) {
    return (
      <div style={styles.container}>
        <style>{globalStyles}</style>
        <div style={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.card}>
              <div className="shimmer" style={{ ...styles.imageWrapper, height: 160 }} />
              <div style={styles.cardBody}>
                <div className="shimmer" style={{ height: 20, width: "60%", marginBottom: 10, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 14, width: "100%", marginBottom: 10, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 40, width: "100%", borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className="product-card" style={styles.card}>
            {/* IMAGE SECTION - Reduced height for compactness */}
            <div style={styles.imageWrapper}>
              <img 
                src={product.image_url || "https://via.placeholder.com/300"} 
                alt={product.product_name} 
                style={styles.image} 
              />
              <div style={styles.dateBadge}>
                <Calendar size={10} />
                {formatDate(product.created_at)}
              </div>
              <div style={styles.usageBadge}>
                {product.usage}
              </div>
            </div>

            {/* BODY SECTION */}
            <div style={styles.cardBody}>
              <div style={styles.headerRow}>
                <div style={styles.info}>
                  <div style={styles.typeLabel}>
                    <Tag size={10} /> {product.type}
                  </div>
                  <h4 style={styles.name}>{product.product_name}</h4>
                </div>

                <div style={{ position: "relative" }}>
                  <button 
                    style={styles.threeDots} 
                    onClick={() => toggleMenu(product.id.toString())}
                  >
                    <MoreVertical size={18} color="#94a3b8" />
                  </button>

                  {activeMenu === product.id.toString() && (
                    <>
                      <div style={styles.menuOverlay} onClick={() => setActiveMenu(null)} />
                      <div style={styles.dropdown}>
                        <button 
                          className="menu-item" 
                          onClick={() => { onUpdate?.(product); setActiveMenu(null); }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <div style={styles.divider} />
                        <button 
                          className="menu-item danger" 
                          onClick={() => { onDelete?.(product.id.toString()); setActiveMenu(null); }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p style={styles.instructionsText}>
                {product.instructions}
              </p>

              <div style={styles.footer}>
                <div style={styles.priceGroup}>
                  <span style={styles.price}>{formatCurrency(product.price)}</span>
                </div>
                <div style={styles.iconContainer}>
                  <TrendingUp size={12} color="#10b981" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "10px 0" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", // Smaller min-width
    gap: 20 
  },
  card: { background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f1f5f9" },
  imageWrapper: { position: "relative", height: 160, background: "#f8fafc" }, // Height reduced from 220 to 160
  image: { width: "100%", height: "100%", objectFit: "cover" },
  dateBadge: { position: "absolute", top: 8, left: 8, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 8, fontSize: 10, color: "#64748b", display: "flex", alignItems: "center", gap: 4 },
  usageBadge: { position: "absolute", bottom: 8, right: 8, background: "#0f172a", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700 },
  cardBody: { padding: 16 }, // Padding reduced from 24 to 16
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  typeLabel: { fontSize: 9, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 },
  name: { fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 },
  instructionsText: { fontSize: 12, color: "#64748b", lineHeight: "1.4", margin: "8px 0 16px 0", height: "34px", overflow: "hidden" },
  footer: { paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
  priceGroup: { display: "flex", flexDirection: "column" },
  price: { fontSize: 18, fontWeight: 800, color: "#0f172a" },
  iconContainer: { padding: 8, borderRadius: 10, background: "#f0fdf4" },
  threeDots: { background: "none", border: "none", cursor: "pointer", padding: 4 },
  dropdown: { position: "absolute", top: "100%", right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: 130, padding: 4, zIndex: 100, border: "1px solid #f1f5f9" },
  menuOverlay: { position: "fixed", inset: 0, zIndex: 99 },
  divider: { height: 1, background: "#f1f5f9", margin: "4px 0" }
};

const globalStyles = `
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  .shimmer {
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.2s linear infinite forwards;
  }
  .product-card { transition: all 0.3s ease; }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08); }
  .menu-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px; border: none; background: none; cursor: pointer; font-size: 12px; color: #475569; border-radius: 6px; }
  .menu-item:hover { background: #f8fafc; color: #0f172a; }
  .menu-item.danger:hover { background: #fff1f2; color: #e11d48; }
`;