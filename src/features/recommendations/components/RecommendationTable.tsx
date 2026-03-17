import type { CSSProperties } from "react";
import { recommendation as recommendationData } from "../data/recommendations";
import type { Recommendation } from "../types/Recommendation";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
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
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Condition</th>
            <th style={styles.th}>Severity</th>
            <th style={styles.th}>Products</th>
            <th style={styles.th}>Treatment</th>
            <th style={styles.th}>Precautions</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recommendation.map((rec) => (
            <tr key={rec.id} style={styles.tr}>
              <td style={styles.td}>{rec.id}</td>
              <td style={styles.td}>{rec.condition}</td>

              {/* 🔥 Severity badge */}
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

              {/* Products */}
              <td style={styles.td}>
                {rec.products?.length ? (
                  rec.products.map((product, index) =>
                    product ? (
                      <span key={product.id}>
                        {product.product_name}
                        {index < rec.products.length - 1 ? ", " : ""}
                      </span>
                    ) : null
                  )
                ) : (
                  "No products"
                )}
              </td>

              <td style={styles.td}>{rec.treatment}</td>
              <td style={styles.td}>{rec.precautions}</td>

            <td style={styles.td}>
            <div style={styles.actions}>
                {onView && (
                <button
                    style={{ ...styles.iconButton, ...styles.viewBtn }}
                    onClick={() => onView(rec)}
                    title="View"
                >
                    <FaEye />
                </button>
                )}

                <button
                style={{ ...styles.iconButton, ...styles.editBtn }}
                onClick={() => onEdit(rec)}
                title="Edit"
                >
                <FaEdit />
                </button>

                {onDelete && (
                <button
                    style={{ ...styles.iconButton, ...styles.deleteBtn }}
                    onClick={() => onDelete(rec.id)}
                    title="Delete"
                >
                    <FaTrash />
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

const styles: Record<string, CSSProperties> = {
  container: {
    marginTop: 20,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  headerRow: {
    background: "#f9fafb",
    textAlign: "left",
  },

  th: {
    padding: "12px 16px",
    fontWeight: 600,
    borderBottom: "1px solid #eee",
  },

  tr: {
    borderBottom: "1px solid #f1f1f1",
  },

  td: {
    padding: "12px 16px",
  },

  actions: {
    display: "flex",
    gap: 8,
  },

  button: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
  },

  viewBtn: {
    background: "#e0f2fe",
    color: "#0369a1",
  },

  editBtn: {
    background: "#fef3c7",
    color: "#92400e",
  },

  deleteBtn: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  badge: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },

  mild: {
    background: "#dcfce7",
    color: "#166534",
  },

  moderate: {
    background: "#fef9c3",
    color: "#854d0e",
  },

  severe: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  iconButton: {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  transition: "0.2s ease",
},
};