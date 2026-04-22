import { useCallback, useMemo, useState } from "react";
import {
  MoreVertical,
  Edit3,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";



type Props = {
  products: Products[];
  onDelete?: (id: string) => void;
  onUpdate?: (product: Products) => void;
  loading?: boolean;
};

/* ---------------- COMPONENT ---------------- */
export default function ProductCardList({
  products,
  onDelete,
  onUpdate,
  loading,
}: Props) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  }, []);

  const toggleMenu = useCallback((id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  }, []);

  const closeMenu = useCallback(() => setActiveMenu(null), []);

  const skeletons = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={styles.card} className="shimmer-effect">
          <div style={{ height: 200, background: "#f1f5f9" }} />
          <div style={{ padding: 20 }}>
            <div
              style={{
                height: 10,
                width: "30%",
                background: "#f1f5f9",
                marginBottom: 12,
              }}
            />
            <div style={{ height: 18, width: "70%", background: "#f1f5f9" }} />
          </div>
        </div>
      )),
    []
  );

  if (loading) {
    return <div style={styles.grid}>{skeletons}</div>;
  }

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>

      <div style={styles.grid}>
        {products.map((product) => {
          const isAvailable = product.status === "Available";

          return (
            <div key={product.id} className="product-card" style={styles.card}>
              {/* IMAGE */}
              <div style={styles.imageWrapper}>
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  style={styles.image}
                />

                <div
                  style={{
                    ...styles.statusBadge,
                    color: isAvailable ? "#10b981" : "#f43f5e",
                    border: `1px solid ${
                      isAvailable ? "#ecfdf5" : "#fff1f2"
                    }`,
                  }}
                >
                  <span
                    style={{
                      ...styles.statusDot,
                      background: isAvailable ? "#10b981" : "#f43f5e",
                    }}
                  />
                  {product.status}
                </div>
              </div>

              {/* BODY */}
              <div style={styles.cardBody}>
                <div style={styles.headerRow}>
                  <div style={styles.info}>
                    <span style={styles.brand}>{product.brand}</span>
                    <h4 style={styles.name}>{product.product_name}</h4>
                  </div>

                  {/* ACTION MENU */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      aria-label="More actions"
                      className="dots-trigger"
                      style={styles.threeDots}
                      onClick={() => toggleMenu(product.id)}
                    >
                      <MoreVertical size={20} color="#94a3b8" />
                    </button>

                    {activeMenu === product.id && (
                      <>
                        <div style={styles.overlay} onClick={closeMenu} />

                        <div style={styles.dropdown}>
                          <button
                            className="menu-item"
                            onClick={() => {
                              onUpdate?.(product);
                              closeMenu();
                            }}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>

                          <div style={styles.divider} />

                          <button
                            className="menu-item danger"
                            onClick={() => {
                              onDelete?.(product.id);
                              closeMenu();
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div style={styles.footer}>
                  <div style={styles.priceGroup}>
                    <span style={styles.priceLabel}>Unit Price</span>
                    <span style={styles.price}>
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <div style={styles.iconContainer}>
                    <TrendingUp size={14} color="#10b981" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles: Record<string, CSSProperties> = {
  container: { padding: "10px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 28,
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    height: 200,
    background: "#f8fafc",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(4px)",
    padding: "5px 10px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },
  cardBody: {
    padding: 20,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: { flex: 1 },
  brand: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  name: {
    margin: "2px 0 0",
    fontSize: 16,
    fontWeight: 600,
    color: "#1e293b",
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceGroup: {
    display: "flex",
    flexDirection: "column",
  },
  priceLabel: {
    fontSize: 11,
    color: "#94a3b8",
  },
  price: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    background: "#f0fdf4",
  },
  threeDots: {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: 4,
    borderRadius: 8,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "#fff",
    borderRadius: 12,
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    width: 130,
    padding: 5,
    zIndex: 100,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 99,
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "4px 0",
  },
};

/* ---------------- GLOBAL CSS ---------------- */
const globalStyles = `
.product-card {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid #f1f5f9;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 30px -10px rgba(0,0,0,0.07);
}

.dots-trigger {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s ease;
}

.product-card:hover .dots-trigger {
  opacity: 1;
  transform: scale(1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.menu-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.menu-item.danger:hover {
  background: #fff1f2;
  color: #e11d48;
}

.shimmer-effect {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
`;