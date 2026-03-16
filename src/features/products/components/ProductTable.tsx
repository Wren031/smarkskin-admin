import { useState, useRef, useEffect } from "react";
import type { Products } from "../types/Products";
import { FaEye, FaTrash } from "react-icons/fa";

interface Props {
  products: Products[];
  onDelete?: (id: number) => void;
  onView?: (product: Products) => void;
  onEdit?: (product: Products) => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 850,
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.6,
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 18px",
    fontSize: 14,
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },

  image: {
    width: 42,
    height: 42,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
  },

  actions: {
    display: "flex",
    gap: 6,
  },

  actionBtn: {
    border: "none",
    cursor: "pointer",
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },

  viewBtn: {
    background: "#eff6ff",
    color: "#2563eb",
  },

  deleteBtn: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  status: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    display: "inline-block",
  },
};

export default function ProductTable({ products, onDelete, onView }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const toggleRow = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.container}>
      <table ref={tableRef} style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Brand</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isSelected = selectedId === product.id;

            return (
              <tr
                key={product.id}
                onClick={() => toggleRow(product.id)}
                style={{
                  backgroundColor: isSelected ? "#f1f5f9" : "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <td style={styles.td}>{product.id}</td>

                <td style={styles.td}>
                  <img src={product.image_url} style={styles.image} />
                </td>

                <td style={{ ...styles.td, fontWeight: 500 }}>
                  {product.product_name}
                </td>

                <td style={styles.td}>{product.brand}</td>

                <td style={styles.td}>{product.description}</td>

                <td style={styles.td}>
                  ₱
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

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
                          ? "#166534"
                          : "#991b1b",
                    }}
                  >
                    {product.status}
                  </span>
                </td>

                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(product);
                      }}
                      style={{ ...styles.actionBtn, ...styles.viewBtn }}
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(product.id);
                      }}
                      style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                    >
                      <FaTrash />
                    </button>
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