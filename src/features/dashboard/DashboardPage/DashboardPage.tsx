import React, { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { 
  Activity, Zap, Users, ShieldCheck, 
  ChevronRight, Filter, UserCheck, TrendingUp, 
  ArrowUpRight
} from "lucide-react";

/* --- TYPES & INTERFACES --- */

interface StatCardProps {
  label: string;
  value: string;
  growth: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

interface ActivityRowProps {
  id: string;
  type: string;
  accuracy: string;
  status: 'Positive' | 'Negative';
}

interface LoginRowProps {
  name: string;
  location: string;
  timestamp: string;
}

/* --- REUSABLE SUB-COMPONENTS --- */

const StatCard: React.FC<StatCardProps> = ({ label, value, growth, icon, trend = 'up' }) => (
  <div className="dashboard-card" style={styles.statCard}>
    <div style={styles.statTop}>
      <div style={styles.statIconContainer}>{icon}</div>
      <div style={{ 
        ...styles.statGrowth, 
        color: trend === 'stable' ? '#64748b' : '#10b981' 
      }}>
        {growth} {trend !== 'stable' && <ArrowUpRight size={12} />}
      </div>
    </div>
    <div style={styles.statContent}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const ActivityRow: React.FC<ActivityRowProps> = ({ id, type, accuracy, status }) => (
  <div className="feed-row" style={styles.activityRow}>
    <div style={{ flex: 2 }}>
      <div style={styles.rowPrimaryText}>{id}</div>
      <div style={styles.rowSecondaryText}>{type}</div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={styles.rowPrimaryText}>{accuracy}</div>
      <div style={styles.rowSecondaryText}>Confidence</div>
    </div>
    <div style={{ flex: 1, textAlign: 'right' }}>
      <span style={{ 
        ...styles.badge,
        backgroundColor: status === 'Positive' ? '#fff1f2' : '#f0fdf4',
        color: status === 'Positive' ? '#e11d48' : '#16a34a'
      }}>{status}</span>
    </div>
  </div>
);

const LoginRow: React.FC<LoginRowProps> = ({ name, location, timestamp }) => (
  <div className="feed-row" style={styles.loginRow}>
    <div style={styles.avatarCircle}><UserCheck size={14} color="#6366f1" /></div>
    <div style={{ flex: 1 }}>
      <div style={styles.rowPrimaryText}>{name}</div>
      <div style={styles.rowSecondaryText}>{location}</div>
    </div>
    <div style={styles.timestampText}>{timestamp}</div>
  </div>
);

/* --- MAIN DASHBOARD --- */

export default function IntelligenceDashboard() {
  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  }), []);

  return (
    <div style={styles.canvas}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .dashboard-card { 
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dashboard-card:hover { 
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }
        .feed-row {
          transition: background-color 0.2s ease;
          cursor: pointer;
          border-radius: 12px;
          margin: 0 -8px;
          padding: 12px 8px;
        }
        .feed-row:hover { background-color: #f8fafc; }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .status-dot { animation: pulse 2s infinite ease-in-out; }
      `}</style>

      {/* HEADER SECTION (CLEANED) */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.mainTitle}>Dashboard</h1>
          <p style={styles.dateSubtitle}>{currentDate} • System Command Center</p>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.statusPill}>
            <div className="status-dot" style={styles.pulseDot} />
            AI Engine: Operational
          </div>
        </div>
      </header>

      {/* ANALYTICS OVERVIEW */}
      <section style={styles.statsGrid}>
        <StatCard label="Total Scans" value="24,812" growth="+12.5%" icon={<Activity size={20} color="#6366f1" />} />
        <StatCard label="Model Accuracy" value="98.24%" growth="+0.4%" icon={<Zap size={20} color="#f59e0b" />} />
        <StatCard label="Active Sessions" value="1,204" growth="+18.2%" icon={<Users size={20} color="#10b981" />} />
        <StatCard label="Uptime" value="99.99%" growth="Stable" trend="stable" icon={<ShieldCheck size={20} color="#06b6d4" />} />
      </section>

      {/* DATA VISUALIZATION */}
      <div style={styles.visualGrid}>
        <div className="dashboard-card" style={styles.mainChartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Throughput Analysis</h3>
              <p style={styles.cardSubtitle}>Scan requests processed per minute</p>
            </div>
            <div style={styles.chartValueHighlight}>1.4k <span style={{fontSize: 12, fontWeight: 500, color: '#94a3b8'}}>RPM</span></div>
          </div>
          <div style={styles.chartPlaceholder}>
             <svg viewBox="0 0 800 200" style={styles.svgFill}>
                <path d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40 L800,200 L0,200 Z" fill="#f5f3ff" />
                <path d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="dashboard-card" style={styles.sideCard}>
           <div style={styles.cardHeader}>
             <h3 style={styles.cardTitle}>System Health</h3>
             <TrendingUp size={18} color="#10b981" />
           </div>
           <div style={styles.healthScoreContainer}>
              <div style={styles.healthValue}>98</div>
              <div style={styles.healthLabel}>Optimal Performance</div>
           </div>
        </div>
      </div>

      {/* ACTIVITY TABLES */}
      <div style={styles.bottomGrid}>
        <div className="dashboard-card" style={styles.feedContainer}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Live Activity Feed</h3>
            <button style={styles.filterBtn}><Filter size={14} /> Filter</button>
          </div>
          <div style={styles.listBody}>
            <ActivityRow id="SCN-8820" type="Dermatitis" accuracy="98.2%" status="Positive" />
            <ActivityRow id="SCN-8819" type="Healthy" accuracy="99.1%" status="Negative" />
            <ActivityRow id="SCN-8818" type="Melanoma" accuracy="96.5%" status="Positive" />
          </div>
          <button style={styles.footerLink}>View detailed logs <ChevronRight size={14} /></button>
        </div>

        <div className="dashboard-card" style={styles.feedContainer}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Security Access</h3>
            <ShieldCheck size={18} color="#94a3b8" />
          </div>
          <div style={styles.listBody}>
            <LoginRow name="Dr. Julian Voss" location="Berlin, DE" timestamp="Just now" />
            <LoginRow name="Sarah Miller" location="New York, US" timestamp="12m ago" />
            <LoginRow name="Wei Zhang" location="Singapore, SG" timestamp="45m ago" />
          </div>
          <button style={styles.footerLink}>Security protocols <ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}


const styles: Record<string, CSSProperties> = {
  canvas: {
    padding: "clamp(12px, 2vw, 24px)",
    backgroundColor: "#fcfcfd",
    minHeight: "100vh",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: "#1e293b"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px"
  },
  mainTitle: { fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 },
  dateSubtitle: { color: "#64748b", fontSize: "14px", marginTop: "4px", fontWeight: 500 },
  headerActions: { display: "flex", alignItems: "center" },
  statusPill: { 
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    fontSize: "13px", 
    fontWeight: 700, 
    color: "#0f172a", 
    background: "#fff", 
    padding: "12px 20px", 
    borderRadius: "14px", 
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  pulseDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" },
  
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "32px" },
  statCard: { padding: "24px" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  statIconContainer: { padding: "10px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" },
  statValue: { fontSize: "28px", fontWeight: 800, color: "#0f172a", lineHeight: 1 },
  statLabel: { fontSize: "14px", color: "#64748b", fontWeight: 500, marginTop: "6px" },
  statGrowth: { fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" },

  visualGrid: { display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "24px", marginBottom: "32px" },
  mainChartCard: { padding: "28px" },
  sideCard: { padding: "28px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  cardTitle: { fontSize: "18px", fontWeight: 700, margin: 0 },
  cardSubtitle: { fontSize: "13px", color: "#94a3b8", marginTop: "4px" },
  chartValueHighlight: { fontSize: "24px", fontWeight: 800 },
  chartPlaceholder: { height: "200px", width: "100%", borderRadius: "12px", overflow: "hidden" },
  svgFill: { width: '100%', height: '100%', display: 'block' },
  
  healthScoreContainer: { display: "flex", flexDirection: "column", alignItems: "center" },
  healthValue: { fontSize: "64px", fontWeight: 800, color: "#6366f1" },
  healthLabel: { fontSize: "14px", fontWeight: 600, color: "#64748b" },

  bottomGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" },
  feedContainer: { padding: "28px" },
  listBody: { display: "flex", flexDirection: "column", gap: "8px" },
  activityRow: { display: "flex", alignItems: "center" },
  loginRow: { display: "flex", alignItems: "center", gap: "16px" },
  rowPrimaryText: { fontSize: "14px", fontWeight: 700, color: "#1e293b" },
  rowSecondaryText: { fontSize: "12px", color: "#94a3b8", fontWeight: 500 },
  badge: { padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" },
  avatarCircle: { width: "36px", height: "36px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" },
  timestampText: { fontSize: "12px", color: "#cbd5e1", fontWeight: 600 },
  footerLink: { marginTop: "24px", background: "none", border: "none", color: "#6366f1", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0 },
  filterBtn: { background: "#fff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }
};