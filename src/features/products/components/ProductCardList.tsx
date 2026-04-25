import { useState } from "react";
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Tag 
} from "lucide-react";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";

type Props = {
  products: Products[];
  onDelete?: (id: string) => void; // ID is now a string
  onUpdate?: (product: Products) => void;
  loading?: boolean;
};

export default function ProductCardList({ products, onDelete, onUpdate, loading }: Props) {
  // State updated to track string ID
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PH", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  if (loading) return <div style={styles.loadingContainer}>Loading tbl_products...</div>;

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className="product-card" style={styles.card}>
            {/* IMAGE SECTION */}
            <div style={styles.imageWrapper}>
              <img 
                src={product.image_url || "https://via.placeholder.com/300"} 
                alt={product.product_name} 
                style={styles.image} 
              />
              <div style={styles.dateBadge}>
                <Calendar size={12} />
                {formatDate(product.created_at)}
              </div>
              <div style={styles.usageBadge}>
                <Clock size={12} />
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
                    className="dots-trigger" 
                    style={styles.threeDots} 
                    onClick={() => toggleMenu(product.id.toString())}
                  >
                    <MoreVertical size={20} color="#94a3b8" />
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
                  <span style={styles.priceLabel}>Price</span>
                  <span style={styles.price}>{formatCurrency(product.price)}</span>
                </div>
                <div style={styles.iconContainer}>
                  <TrendingUp size={14} color="#10b981" />
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
  container: { padding: "20px 0" },
  loadingContainer: { textAlign: "center", padding: "50px", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 30 },
  card: { background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9" },
  imageWrapper: { position: "relative", height: 220, background: "#f8fafc" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  dateBadge: { position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.9)", padding: "6px 12px", borderRadius: 12, fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6 },
  usageBadge: { position: "absolute", bottom: 12, right: 12, background: "#0f172a", color: "#fff", padding: "6px 12px", borderRadius: 10, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 },
  cardBody: { padding: 24 },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  typeLabel: { fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 },
  name: { fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 },
  instructionsText: { fontSize: 13, color: "#64748b", lineHeight: "1.6", margin: "10px 0 20px 0", height: "40px", overflow: "hidden" },
  footer: { paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  priceGroup: { display: "flex", flexDirection: "column" },
  price: { fontSize: 20, fontWeight: 800, color: "#0f172a" },
  priceLabel: { fontSize: 11, color: "#94a3b8" },
  iconContainer: { padding: 10, borderRadius: 12, background: "#f0fdf4" },
  threeDots: { background: "none", border: "none", cursor: "pointer" },
  dropdown: { position: "absolute", top: "100%", right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: 140, padding: 6, zIndex: 100, border: "1px solid #f1f5f9" },
  menuOverlay: { position: "fixed", inset: 0, zIndex: 99 },
  divider: { height: 1, background: "#f1f5f9", margin: "4px 0" }
};

const globalStyles = `
  .product-card { transition: all 0.3s ease; }
  .product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
  .menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px; border: none; background: none; cursor: pointer; font-size: 13px; color: #475569; border-radius: 8px; }
  .menu-item:hover { background: #f8fafc; color: #0f172a; }
  .menu-item.danger:hover { background: #fff1f2; color: #e11d48; }
`;