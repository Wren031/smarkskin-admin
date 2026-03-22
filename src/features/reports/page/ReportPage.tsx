import type { CSSProperties } from "react";

export default function ReportPage() {
    // Trend data for the charts
    const userTrend = [30, 45, 35, 60, 55, 80, 95];
    const productTrend = [40, 42, 45, 43, 48, 52, 55];
    const conditionTrend = [10, 15, 8, 20, 18, 25, 30];
    const recoTrend = [20, 50, 40, 70, 65, 90, 100];

    const handleExport = () => window.print();

    const Sparkline = ({ data, color }: { data: number[], color: string }) => {
        const max = Math.max(...data);
        const points = data.map((val, i) => 
            `${(i * (140 / (data.length - 1)))},${50 - (val / max * 40)}`
        ).join(" ");

        return (
            <svg viewBox="0 0 140 50" style={styles.sparkline}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <path d={`M 0 50 L ${points} L 140 50 Z`} fill={`url(#grad-${color})`} />
                <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
            </svg>
        );
    };

    return (
        <div style={styles.container} id="report-content">
            {/* Header Section */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.badge}>System Audit 2026</div>
                    <h1 style={styles.title}>Management Architecture Report</h1>
                    <p style={styles.subtitle}>Comprehensive analysis of user engagement and product-condition mapping.</p>
                </div>
                <button onClick={handleExport} style={styles.exportBtn} className="no-print">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Export Document
                </button>
            </header>

            {/* Metrics Grid */}
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardLabel}>User Management</span>
                        <div style={styles.statusDot} />
                    </div>
                    <div style={styles.cardBody}>
                        <span style={styles.cardValue}>1,240</span>
                        <span style={styles.cardTrend}>↑ 12.5%</span>
                    </div>
                    <Sparkline data={userTrend} color="#4f46e5" />
                </div>

                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardLabel}>Product Inventory</span>
                        <div style={styles.statusDot} />
                    </div>
                    <div style={styles.cardBody}>
                        <span style={styles.cardValue}>85</span>
                        <span style={styles.cardTrendNeutral}>Stable</span>
                    </div>
                    <Sparkline data={productTrend} color="#0ea5e9" />
                </div>

                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardLabel}>Condition Logs</span>
                        <div style={styles.statusDot} />
                    </div>
                    <div style={styles.cardBody}>
                        <span style={styles.cardValue}>12</span>
                        <span style={styles.cardTrend}>↑ 4.2%</span>
                    </div>
                    <Sparkline data={conditionTrend} color="#10b981" />
                </div>

                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardLabel}>Recommendation Engine</span>
                        <div style={styles.statusDot} />
                    </div>
                    <div style={styles.cardBody}>
                        <span style={styles.cardValue}>342</span>
                        <span style={styles.cardTrend}>↑ 18.1%</span>
                    </div>
                    <Sparkline data={recoTrend} color="#f59e0b" />
                </div>
            </div>

            {/* Deep Dive Table */}
            <section style={styles.tableSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Technical Interface Specifications</h2>
                    <p style={styles.sectionSubtitle}>Data validation and type safety coverage.</p>
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Interface</th>
                            <th style={styles.th}>Core Responsibility</th>
                            <th style={styles.th}>Data Source</th>
                            <th style={styles.th}>Reliability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={styles.td}><code>User</code></td>
                            <td style={styles.td}>Demographics & Status Tracking</td>
                            <td style={styles.td}>Identity Provider</td>
                            <td style={styles.td}><span style={styles.pill}>High</span></td>
                        </tr>
                        <tr>
                            <td style={styles.td}><code>Products</code></td>
                            <td style={styles.td}>Inventory & Pricing Logic</td>
                            <td style={styles.td}>Product DB</td>
                            <td style={styles.td}><span style={styles.pill}>High</span></td>
                        </tr>
                        <tr>
                            <td style={styles.td}><code>SkinCondition</code></td>
                            <td style={styles.td}>Dermatological Classification</td>
                            <td style={styles.td}>Clinical Dataset</td>
                            <td style={styles.td}><span style={styles.pillOrange}>Medium</span></td>
                        </tr>
                        <tr>
                            <td style={styles.td}><code>Recommendation</code></td>
                            <td style={styles.td}>Severity-to-Treatment Mapping</td>
                            <td style={styles.td}>Decision Engine</td>
                            <td style={styles.td}><span style={styles.pill}>High</span></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    #report-content { padding: 0 !important; }
                }
                code { background: #f1f5f9; padding: 2px 6px; borderRadius: 4px; font-family: monospace; color: #475569; }
            `}</style>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        padding: "50px 80px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#1e293b"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "40px",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "24px"
    },
    badge: {
        backgroundColor: "#e0e7ff",
        color: "#4338ca",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 12px",
        borderRadius: "20px",
        display: "inline-block",
        marginBottom: "12px"
    },
    title: { fontSize: "32px", fontWeight: "800", margin: 0, letterSpacing: "-0.025em" },
    subtitle: { color: "#64748b", fontSize: "16px", marginTop: "8px" },
    exportBtn: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.2s"
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" },
    card: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9"
    },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    cardLabel: { fontSize: "13px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    statusDot: { width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%" },
    cardBody: { display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" },
    cardValue: { fontSize: "28px", fontWeight: "700" },
    cardTrend: { fontSize: "12px", color: "#10b981", fontWeight: "600" },
    cardTrendNeutral: { fontSize: "12px", color: "#94a3b8" },
    sparkline: { width: "100%", height: "50px" },
    tableSection: { backgroundColor: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    sectionHeader: { marginBottom: "24px" },
    sectionTitle: { fontSize: "20px", fontWeight: "700", margin: 0 },
    sectionSubtitle: { color: "#64748b", fontSize: "14px" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "16px", fontSize: "13px", color: "#64748b", borderBottom: "1px solid #f1f5f9" },
    td: { padding: "16px", fontSize: "14px", borderBottom: "1px solid #f1f5f9" },
    pill: { backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
    pillOrange: { backgroundColor: "#ffedd5", color: "#9a3412", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }
};