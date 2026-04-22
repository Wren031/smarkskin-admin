import React from "react";
import { Calendar, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminSkinHistory } from "../hooks/useScanData";

export default function AdminSkinLogsPage() {
  const navigate = useNavigate();
  const { results, loading } = useAdminSkinHistory();

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Admin Logs...</div>;

  return (
    <div style={{ padding: "32px", backgroundColor: "#f4f7f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a202c" }}>System-wide Skin Scans</h1>
        <p style={{ color: "#718096" }}>Administrative view of all patient analysis results.</p>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #edf2f7" }}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Scan Date</th>
              <th style={thStyle}>Conditions Found</th>
              <th style={thStyle}>Skin Type</th>
              <th style={thStyle}>Confidence</th>
              <th style={thStyle}>Severity</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((scan) => (
                <tr 
                  key={scan.id} 
                  onClick={() => navigate(`/admin/view-scan/${scan.id}`)}
                  style={{ borderBottom: "1px solid #edf2f7", cursor: "pointer" }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={avatarCircle}><User size={14} color="#4a5568" /></div>
                      <span style={{ fontWeight: 600 }}>
                        {scan.tbl_profiles?.first_name || "Guest"} {scan.tbl_profiles?.last_name || "User"}
                      </span>
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4a5568" }}>
                      <Calendar size={14} />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  {/* NEW COLUMN: Mapping the joined conditions */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {scan.tbl_skin_conditions?.length > 0 ? (
                        scan.tbl_skin_conditions.slice(0, 2).map((c: any, i: number) => (
                          <span key={i} style={tagStyle}>{c.label}</span>
                        ))
                      ) : (
                        <span style={{ color: "#cbd5e0" }}>None</span>
                      )}
                      {scan.tbl_skin_conditions?.length > 2 && (
                        <span style={{ fontSize: "11px", color: "#a0aec0" }}>+{scan.tbl_skin_conditions.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  <td style={tdStyle}>{scan.skin_type || "N/A"}</td>

                  <td style={tdStyle}>
                    <span style={{ color: scan.confidence > 70 ? "#2f855a" : "#c05621", fontWeight: 600 }}>
                      {/* Handling both decimal (0.92) and whole number (92) formats */}
                      {scan.confidence > 1 ? scan.confidence : (scan.confidence * 100).toFixed(1)}%
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <span style={{ 
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      fontSize: "12px", 
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: scan.overall_severity?.toLowerCase() === 'healthy' ? '#f0fff4' : '#fff5f5',
                      color: scan.overall_severity?.toLowerCase() === 'healthy' ? '#2f855a' : '#c53030'
                    }}>
                      {scan.overall_severity || "Low"}
                    </span>
                  </td>

                  <td style={{ textAlign: "right", paddingRight: "24px" }}>
                    <ChevronRight size={18} color="#cbd5e0" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#a0aec0" }}>
                  No scan records found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const thStyle: React.CSSProperties = {
  padding: "16px 24px",
  textAlign: "left",
  fontSize: "12px",
  color: "#a0aec0",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle: React.CSSProperties = {
  padding: "16px 24px",
  fontSize: "14px",
  color: "#2d3748"
};

const tagStyle: React.CSSProperties = {
  backgroundColor: "#ebf8ff",
  color: "#2b6cb0",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: 600
};

const avatarCircle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#edf2f7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};