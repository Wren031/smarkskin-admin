import React from "react";
import { Calendar, User, ChevronRight, Activity, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminSkinHistory } from "../hooks/useScanData";

export default function AdminSkinLogsPage() {
  const navigate = useNavigate();
  const { results, loading } = useAdminSkinHistory();

  if (loading) {
    return (
      <div style={styles.loadingState}>
        <Activity className="animate-spin" size={24} color="#6366f1" />
        <p style={{ marginTop: "12px", color: "#64748b", fontWeight: 500 }}>Initializing system logs...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>System-wide Skin Scans</h1>
          <p style={styles.headerSubtitle}>Comprehensive administrative audit of patient diagnostic analysis.</p>
        </div>
        <div style={styles.statsBadge}>
          <Database size={14} />
          <span>{results.length} Total Records</span>
        </div>
      </header>

      {/* Table Container */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Scan Date</th>
              <th style={styles.th}>Detected Conditions</th>
              <th style={styles.th}>Skin Type</th>
              <th style={styles.th}>Confidence Score</th>
              <th style={styles.th}>Severity Level</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((scan) => (
                <tr 
                  key={scan.id} 
                  onClick={() => navigate(`/admin/view-scan/${scan.id}`)}
                  style={styles.tr}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={styles.td}>
                    <div style={styles.patientInfo}>
                      <div style={styles.avatarCircle}>
                        <User size={14} color="#64748b" />
                      </div>
                      <span style={styles.patientName}>
                        {scan.tbl_profiles?.first_name || "Guest"} {scan.tbl_profiles?.last_name || "User"}
                      </span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.dateInfo}>
                      <Calendar size={14} color="#94a3b8" />
                      {new Date(scan.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.tagContainer}>
                      {scan.tbl_skin_conditions?.length > 0 ? (
                        scan.tbl_skin_conditions.slice(0, 2).map((c: any, i: number) => (
                          <span key={i} style={styles.tag}>{c.label}</span>
                        ))
                      ) : (
                        <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No findings</span>
                      )}
                      {scan.tbl_skin_conditions?.length > 2 && (
                        <span style={styles.moreCount}>+{scan.tbl_skin_conditions.length - 2}</span>
                      )}
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span style={styles.skinTypeText}>{scan.skin_type || "Unknown"}</span>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.confidenceWrapper}>
                      <div style={styles.confidenceBarContainer}>
                        <div style={{ 
                          ...styles.confidenceBar, 
                          width: `${scan.confidence > 1 ? scan.confidence : scan.confidence * 100}%`,
                          backgroundColor: scan.confidence > 0.7 ? "#10b981" : "#f59e0b"
                        }} />
                      </div>
                      <span style={{ 
                        fontWeight: 700, 
                        color: scan.confidence > 0.7 ? "#059669" : "#d97706",
                        fontSize: "13px"
                      }}>
                        {scan.confidence > 1 ? scan.confidence : (scan.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.severityBadge,
                      ...(scan.overall_severity?.toLowerCase() === 'healthy' ? styles.severityHealthy : styles.severityConcern)
                    }}>
                      {scan.overall_severity || "Low"}
                    </span>
                  </td>

                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.viewButton}>
                      View Report <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={styles.emptyState}>
                  No diagnostic records found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    padding: "40px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8fafc"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.025em",
    margin: 0,
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: "15px",
    marginTop: "4px",
  },
  statsBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px -2px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeaderRow: {
    backgroundColor: "#fcfdfe",
    borderBottom: "1px solid #f1f5f9",
  },
  th: {
    padding: "16px 24px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  td: {
    padding: "18px 24px",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle",
  },
  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  patientName: {
    fontWeight: 600,
    color: "#0f172a",
  },
  avatarCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
  },
  dateInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontWeight: 500,
  },
  tagContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tag: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    border: "1px solid #dbeafe",
  },
  moreCount: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: 500,
  },
  skinTypeText: {
    fontWeight: 500,
    color: "#475569",
    backgroundColor: "#f8fafc",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #f1f5f9"
  },
  confidenceWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  confidenceBarContainer: {
    width: "60px",
    height: "6px",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    overflow: "hidden",
  },
  confidenceBar: {
    height: "100%",
    borderRadius: "10px",
  },
  severityBadge: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    display: "inline-block",
  },
  severityHealthy: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    border: "1px solid #d1fae5",
  },
  severityConcern: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    border: "1px solid #ffe4e6",
  },
  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "transparent",
    border: "none",
    color: "#6366f1",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyState: {
    padding: "60px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "15px",
  }
};