import { useState } from "react";
import type { Products } from "../types/Products";
import { FaEllipsisV } from "react-icons/fa";

interface Props {
  products: Products[];
  onDelete?: (id: number) => void;
  onView?: (product: Products) => void;
}

export default function ProductTable({ products, onDelete, onView }: Props) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  if (products.length === 0) {
    return <div style={styles.empty}>No products found</div>;
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Brand</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
                        <th style={styles.th}></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isMenuOpen = menuOpenId === product.id;

            return (
              <tr key={product.id} style={styles.tr}>
                {/* Product Info */}
                <td style={styles.td}>
                  <div style={styles.productCell}>
                    <img src={product.image_url} style={styles.image} />
                    <div>
                      <div style={styles.name}>
                        {product.product_name}
                      </div>
                      <div style={styles.description}>
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={styles.td}>{product.brand}</td>

                <td style={styles.td}>
                  ₱
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Status */}
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      background:
                        product.status === "Available"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        product.status === "Available"
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    {product.status}
                  </span>
                </td>

                {/* Actions */}
                <td style={styles.td}>
                  <div style={styles.menuWrapper}>
                    <button
                      onClick={() =>
                        setMenuOpenId((prev) =>
                          prev === product.id ? null : product.id
                        )
                      }
                      style={styles.menuButton}
                    >
                      <FaEllipsisV />
                    </button>

                    {isMenuOpen && (
                      <div style={styles.dropdown}>
                        <button
                          onClick={() => {
                            onView?.(product);
                            setMenuOpenId(null);
                          }}
                          style={styles.dropdownItem}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            onDelete?.(product.id);
                            setMenuOpenId(null);
                          }}
                          style={{
                            ...styles.dropdownItem,
                            color: "#dc2626",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    fontSize: 12,
    fontWeight: 600,
    color: "#7b7c7c",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "14px 16px",
    fontSize: 14,
    verticalAlign: "middle",
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    objectFit: "cover",
    border: "1px solid #e5e7eb",
  },

  name: {
    fontWeight: 600,
    fontSize: 14,
  },

  description: {
    fontSize: 12,
    color: "#6b7280",
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  status: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },

  menuWrapper: {
    position: "relative",
  },

  menuButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },

  dropdown: {
    position: "absolute",
    top: 28,
    right: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    minWidth: 130,
    zIndex: 10,
  },

  dropdownItem: {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
};