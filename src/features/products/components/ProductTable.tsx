import React from "react";
import {
  FaEye,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import type { Products } from "../types/Products";

interface Props {
  products: Products[];
  onDelete?: (id: number) => void;
  onView?: (product: Products) => void;
  onUpdate?: (product: Products) => void;
}

export default function ProductTable({
  products,
  onDelete,
  onView,
  onUpdate,
}: Props) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const getStatusStyles = (status: string) => {
    const isAvailable = status.toLowerCase() === "available";
    return {
      backgroundColor: isAvailable ? "#ECFDF5" : "#FEF2F2",
      color: isAvailable ? "#059669" : "#DC2626",
    };
  };

  if (products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No products available in the inventory.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product Details</th>
            <th style={styles.th}>Brand</th>
            <th style={styles.th}>Unit Price</th>
            <th style={styles.th}>Stock Status</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={styles.tr}>
              {/* PRODUCT */}
              <td style={styles.td}>
                <div style={styles.productCell}>
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={styles.image}
                  />
                  <div style={styles.textGroup}>
                    <span style={styles.productName}>
                      {product.product_name}
                    </span>
                    <span style={styles.productDesc}>
                      {product.description}
                    </span>
                  </div>
                </div>
              </td>

              {/* BRAND */}
              <td style={styles.td}>{product.brand}</td>

              {/* PRICE */}
              <td style={{ ...styles.td, fontWeight: 600 }}>
                {formatCurrency(product.price)}
              </td>

              {/* STATUS */}
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    ...getStatusStyles(product.status),
                  }}
                >
                  {product.status}
                </span>
              </td>

              {/* ACTION ICONS */}
              <td style={{ ...styles.td, textAlign: "right" }}>
                <div style={styles.actions}>
                  
                  {/* VIEW */}
                  <button
                    style={{...styles.iconBtn,color: "#2563eb",}}
                    onClick={() => onView?.(product)}
                    title="View"
                  >
                    <FaEye />
                  </button>

                  {/* UPDATE */}
                  <button
                  
                    style={{...styles.iconBtn,color: "#d97706",}}
                    onClick={() => onUpdate?.(product)}
                    title="Update"
                  >
                    <FaRegEdit />
                  </button>

                  {/* DELETE */}
                  <button
                    style={{ ...styles.iconBtn, color: "#DC2626" }}
                    onClick={() => onDelete?.(product.id)}
                    title="Delete"
                  >
                    <FaRegTrashAlt />
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  th: {
    backgroundColor: "#F9FAFB",
    padding: "12px 24px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6B7280",
    borderBottom: "1px solid #E5E7EB",
  },

  tr: {
    borderBottom: "1px solid #F3F4F6",
  },

  td: {
    padding: "16px 24px",
    fontSize: "14px",
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  image: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    objectFit: "cover",
  },

  textGroup: {
    display: "flex",
    flexDirection: "column",
  },

  productName: {
    fontWeight: 600,
  },

  productDesc: {
    fontSize: "12px",
    color: "#6B7280",
  },

  badge: {
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 500,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  iconBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    color: "#6B7280",
    padding: "6px",
    borderRadius: "6px",
    transition: "0.2s",
  },

  emptyState: {
    padding: "60px",
    textAlign: "center",
    color: "#6B7280",
  },
};