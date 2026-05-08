import React, { useState, useMemo } from "react";
import { Search, Activity, Printer, Database, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { useAdminSkinHistory } from "../hooks/useScanData";
import ScanDetailsDrawer from "../components/drawerScanDetails";
import { SkinLogsTable } from "../components/SkinLogsTable";

export default function UserScanPage() {
  const { results, loading } = useAdminSkinHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedScan, setSelectedScan] = useState<any>(null);

  const filtered = useMemo(() => {
    return results.filter(s => {
      const matchesSearch = s.user_name.toLowerCase().includes(searchTerm.toLowerCase());
      const score = s.score || 0;
      if (filterType === "high") return matchesSearch && score >= 80;
      if (filterType === "low") return matchesSearch && score < 50;
      return matchesSearch;
    });
  }, [results, searchTerm, filterType]);

  const stats = useMemo(() => {
    if (!results.length) return { total: "0", lowCount: "0", highCount: "0" };
    return {
      total: results.length.toLocaleString(),
      lowCount: results.filter(r => (r.score || 0) < 50).length.toLocaleString(),
      highCount: results.filter(r => (r.score || 0) >= 80).length.toLocaleString()
    };
  }, [results]);

  if (loading) return (
    <div style={styles.center}><Activity className="animate-spin" color="#0f172a" /></div>
  );

  return (
    <div style={styles.page}>
      <header style={styles.header} className="no-print">
        <div>
          <h1 style={styles.title}>Clinical History</h1>
          <p style={styles.subtitle}>Comprehensive patient diagnostic records</p>
        </div>
      </header>

      {/* Stats Cards Section */}
      <div style={styles.statsGrid} className="no-print">
        
        {/* Total Logs Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#f5f3ff"}}>
              <Database size={20} color="#7c3aed" />
            </div>
            <div style={styles.trendGreen}>+12.5% ↗</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.total}</h2>
            <p style={styles.cardLabel}>Total Scans</p>
          </div>
        </div>

        {/* High Proficiency Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#f0fdf4"}}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div style={styles.trendGreen}>+0.4% ↗</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.highCount}</h2>
            <p style={styles.cardLabel}>High Proficiency</p>
          </div>
        </div>

        {/* Critical Review Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#fff1f2"}}>
              <AlertCircle size={20} color="#e11d48" />
            </div>
            <div style={styles.trendRed}>+18.2% ↗</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.lowCount}</h2>
            <p style={styles.cardLabel}>Critical Review</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={styles.tableActions} className="no-print">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={styles.searchBox}>
            <Search size={16} color="#94a3b8" />
            <input
              style={styles.input}
              placeholder="Filter by patient name..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.selectContainer}>
            <select 
              style={styles.customSelect} 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="high">High Proficiency</option>
              <option value="low">Critical Review</option>
            </select>
            <div style={styles.selectIcon}>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>

        <button onClick={() => window.print()} style={styles.blackBtn}>
          <Printer size={16} />
          Export Records
        </button>
      </div>

      <div className="print-area">
        <SkinLogsTable data={filtered} onRowClick={setSelectedScan} rowsPerPage={10} />
      </div>

      <ScanDetailsDrawer
        isOpen={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        scan={selectedScan}
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { width: 100%; }
        }
        
        .stat-card-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer;
        }

        .stat-card-animate:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1 !important;
        }

        select:hover { border-color: #cbd5e1 !important; }
        select:focus { border-color: #0f172a !important; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "40px", backgroundColor: "#fcfcfd", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: 900, color: "#000000", margin: 0 },
  subtitle: { color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" },
  
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "20px", 
    marginBottom: "40px" 
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #eef2f6",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "160px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: { marginTop: "auto" },
  trendGreen: { color: "#10b981", fontSize: "13px", fontWeight: 600 },
  trendRed: { color: "#ef4444", fontSize: "13px", fontWeight: 600 },
  cardValue: { fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" },
  cardLabel: { fontSize: "14px", color: "#64748b", margin: 0, fontWeight: 500 },

  tableActions: { display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" },
  searchBox: { 
    display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", 
    padding: "0 14px", borderRadius: "8px", border: "1px solid #e2e8f0", height: "40px"
  },
  input: { border: "none", outline: "none", width: "220px", fontSize: "14px", color: "#1e293b" },
  selectContainer: { position: "relative", display: "flex", alignItems: "center" },
  customSelect: {
    appearance: "none", backgroundColor: "#fff", border: "1px solid #e2e8f0",
    borderRadius: "8px", padding: "0 36px 0 14px", height: "40px", fontSize: "14px",
    fontWeight: 500, color: "#475569", cursor: "pointer", outline: "none"
  },
  selectIcon: { position: "absolute", right: "12px", pointerEvents: "none" },
  blackBtn: { 
    display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0f172a", 
    color: "#fff", border: "none", padding: "0 18px", borderRadius: "8px", 
    cursor: "pointer", fontSize: "14px", fontWeight: 600, height: "40px", transition: "background 0.2s"
  }
};