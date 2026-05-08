import React, { useState } from "react";
import { User, Fingerprint, Activity, ShieldCheck, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface SkinLogsTableProps {
  data: any[];
  onRowClick: (scan: any) => void;
  rowsPerPage?: number;
}

export const SkinLogsTable = ({ data, onRowClick, rowsPerPage = 7 }: SkinLogsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Reference</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Primary Finding</th>
              <th style={styles.th}>Health Score</th>
              <th style={styles.th}>Confidence</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((scan) => {
              const userAvatar = scan.tbl_profiles?.avatar_url;
              const shortId = scan.id ? `#${scan.id.toString().slice(0, 8)}` : "N/A";
              const score = scan.score || 0;
              const rawConf = scan.confidence > 1 ? scan.confidence : scan.confidence * 100;
              const displayConf = Math.round(rawConf || 0);

              return (
                <tr 
                  key={scan.id} 
                  style={{
                    ...styles.tr,
                    backgroundColor: hoveredRow === scan.id ? "#f9fafb" : "transparent"
                  }}
                  onMouseEnter={() => setHoveredRow(scan.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRowClick(scan)}
                >
                  <td style={styles.td}>
                    <div style={styles.flexCell}>
                      <Fingerprint size={16} style={{ color: "#94a3b8" }} />
                      <span style={styles.idText}>{shortId}</span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.flexCell}>
                      <div style={styles.avatar}>
                        {userAvatar ? (
                          <img src={userAvatar} style={styles.avatarImg} alt="" />
                        ) : (
                          <User size={16} color="#64748b" />
                        )}
                      </div>
                      <span style={styles.patientName}>{scan.user_name}</span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span style={styles.dateText}>
                      {new Date(scan.created_at).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <span style={{
                      ...styles.findingBadge,
                      backgroundColor: (scan.conditions?.[0]?.label || "").toLowerCase().includes("normal") ? "#ecfdf5" : "#fff7ed",
                      color: (scan.conditions?.[0]?.label || "").toLowerCase().includes("normal") ? "#065f46" : "#9a3412"
                    }}>
                      {scan.conditions?.[0]?.label || "Normal"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.flexCell}>
                      <Activity size={16} color={score > 70 ? "#10b981" : "#f59e0b"} />
                      <span style={styles.scoreText}>{score}</span>
                      <span style={styles.scoreScale}>/100</span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.flexCell}>
                      <ShieldCheck size={16} color="#6366f1" />
                      <span style={styles.confText}>{displayConf}%</span>
                    </div>
                  </td>

                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={{
                      ...styles.actionBtn,
                      opacity: hoveredRow === scan.id ? 1 : 0.4,
                    }}>
                      <div style={{
                        ...styles.iconCircle,
                        backgroundColor: hoveredRow === scan.id ? "#6366f1" : "#f1f5f9",
                        color: hoveredRow === scan.id ? "#fff" : "#64748b",
                      }}>
                        <Eye size={18} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={styles.paginationFooter}>
        <p style={styles.paginationInfo}>
          Showing <b>{indexOfFirstRow + 1}</b> to <b>{Math.min(indexOfLastRow, data.length)}</b> of <b>{data.length}</b> entries
        </p>
        <div style={styles.paginationControls}>
          <button 
            disabled={currentPage === 1}
            onClick={(e) => { e.stopPropagation(); paginate(currentPage - 1); }}
            style={{ ...styles.pageBtn, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div style={styles.pageIndicator}>
            Page <b>{currentPage}</b> of {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={(e) => { e.stopPropagation(); paginate(currentPage + 1); }}
            style={{ ...styles.pageBtn, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { 
    backgroundColor: "#fff", 
    borderRadius: "12px", 
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { 
    padding: "16px 24px", 
    textAlign: "left", 
    fontSize: "13px", 
    fontWeight: 600,
    color: "#374151", 
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb"
  },
  td: { 
    padding: "18px 24px", 
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
    fontSize: "15px" 
  },
  tr: { cursor: "pointer", transition: "background-color 0.15s ease" },
  flexCell: { display: "flex", alignItems: "center", gap: "12px" },
  idText: { fontFamily: "monospace", fontSize: "14px", color: "#6b7280" },
  patientName: { fontSize: "15px", fontWeight: 600, color: "#111827" },
  dateText: { color: "#4b5563", fontWeight: 500 },
  findingBadge: { 
    fontSize: "13px", 
    fontWeight: 600, 
    padding: "6px 12px", 
    borderRadius: "8px",
    display: "inline-block"
  },
  scoreText: { fontSize: "16px", fontWeight: 700, color: "#111827" },
  scoreScale: { fontSize: "12px", color: "#9ca3af" },
  confText: { fontSize: "15px", fontWeight: 600, color: "#374151" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f3f4f6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e7eb" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  actionBtn: { display: "flex", justifyContent: "flex-end" },
  iconCircle: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  
  paginationFooter: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTop: "1px solid #e5e7eb"
  },
  paginationInfo: { fontSize: "14px", color: "#6b7280", margin: 0 },
  paginationControls: { display: "flex", alignItems: "center", gap: "16px" },
  pageIndicator: { fontSize: "14px", color: "#374151" },
  pageBtn: {
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151"
  }
};