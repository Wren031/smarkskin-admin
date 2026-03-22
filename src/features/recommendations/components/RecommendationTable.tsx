import { useState, type CSSProperties } from "react";
import { recommendation as recommendationData } from "../data/recommendations";
import type { Recommendation } from "../types/Recommendation";
import {
  FaEye,
  FaRegEdit,
  FaRegTrashAlt,
  FaCapsules,
} from "react-icons/fa";

interface Props {
  recommendation?: Recommendation[];
  onDelete?: (id: number) => void;
  onView?: (recommendation: Recommendation) => void;
  onEdit: (recommendation: Recommendation) => void;
}

export default function RecommendationTable({
  recommendation = recommendationData,
  onDelete,
  onView,
  onEdit,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={{ ...styles.th, width: "60px" }}>ID</th>
            <th style={styles.th}>Condition</th>
            <th style={styles.th}>Severity</th>
            <th style={styles.th}>Treatment Plan</th>
            <th style={styles.th}>Products</th>
            <th style={styles.th}>Precautions Plan</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recommendation.map((rec) => (
            <tr
              key={rec.id}
              onMouseEnter={() => setHoveredRow(rec.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                ...styles.tr,
                backgroundColor:
                  hoveredRow === rec.id ? "#f9fafb" : "transparent",
              }}
            >
              {/* ID */}
              <td style={{ ...styles.td, color: "#9ca3af", fontWeight: 500 }}>
                #{rec.id}
              </td>

              {/* CONDITION */}
              <td style={{ ...styles.td, fontWeight: 600, color: "#111827" }}>
                {rec.condition.name}
              </td>

              {/* SEVERITY */}
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    ...(rec.severity === "Severe"
                      ? styles.severe
                      : rec.severity === "Moderate"
                      ? styles.moderate
                      : styles.mild),
                  }}
                >
                  {rec.severity}
                </span>
              </td>

              {/* TREATMENT */}
              <td style={{ ...styles.td, maxWidth: "250px" }}>
                <div style={styles.treatmentText}>
                  {rec.treatment || (
                    <span style={styles.emptyText}>No treatment</span>
                  )}
                </div>
              </td>

              {/* PRODUCTS */}
              <td style={styles.td}>
                <div style={styles.productContainer}>
                  {rec.products?.length ? (
                    rec.products.map((product) => (
                      <span key={product.id} style={styles.productTag}>
                        <FaCapsules style={{ marginRight: 4, fontSize: 10 }} />
                        {product.product_name}
                      </span>
                    ))
                  ) : (
                    <span style={styles.emptyText}>None linked</span>
                  )}
                </div>
              </td>

              {/* PRECAUTIONS */}
              <td style={{ ...styles.td, maxWidth: "250px" }}>
                <div style={styles.precautionText}>
                  {rec.precautions ? (
                    rec.precautions
                  ) : (
                    <span style={styles.emptyText}>No precautions</span>
                  )}
                </div>
              </td>

              {/* ACTIONS */}
              <td style={{ ...styles.td, textAlign: "right" }}>
                <div style={styles.actions}>
                  {onView && (
                    <button
                      style={{ ...styles.iconButton, ...styles.viewBtn }}
                      onClick={() => onView(rec)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  )}

                  <button
                    style={{ ...styles.iconButton, ...styles.editBtn }}
                    onClick={() => onEdit(rec)}
                    title="Edit Entry"
                  >
                    <FaRegEdit />
                  </button>

                  {onDelete && (
                    <button
                      style={{ ...styles.iconButton, ...styles.deleteBtn }}
                      onClick={() => onDelete(rec.id)}
                      title="Remove"
                    >
                      <FaRegTrashAlt />
                    </button>
                  )}
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

const styles: Record<string, CSSProperties> = {
  container: {
    margin: "24px 0",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  headerRow: {
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },

  th: {
    padding: "14px 20px",
    fontWeight: 600,
    color: "#4b5563",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.05em",
    textAlign: "left",
  },

  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background-color 0.2s ease",
  },

  td: {
    padding: "16px 20px",
    verticalAlign: "middle",
    color: "#374151",
  },

  productContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  productTag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    background: "#f3f4f6",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
  },

  treatmentText: {
    fontWeight: 500,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  precautionText: {
    fontSize: "12px",
    color: "#6b7280",
    background: "#f9fafb",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px dashed #e5e7eb",
  },

  emptyText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },

  actions: {
    display: "inline-flex",
    gap: "8px",
    justifyContent: "flex-end",
  },

  iconButton: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "all 0.2s ease",
  },

  viewBtn: { color: "#2563eb" },
  editBtn: { color: "#d97706" },
  deleteBtn: { color: "#dc2626" },

  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    display: "inline-block",
  },

  mild: { background: "#ecfdf5", color: "#065f46" },
  moderate: { background: "#fffbeb", color: "#92400e" },
  severe: { background: "#fef2f2", color: "#991b1b" },
};