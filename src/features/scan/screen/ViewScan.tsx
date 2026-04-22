import React from "react";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  User,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewScanPage() {
  const navigate = useNavigate();

  // Mock data for the specific scan view
  const scanDetails = {
    id: "SCAN-88291",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    date: "April 12, 2026",
    time: "14:30 PM",
    user: "John Doe",
    condition: "Hyperpigmentation",
    accuracy: 94.2,
    severity: "Moderate",
    recommendation: "Apply Vitamin C serum daily in the morning. Ensure SPF 50+ application every 2 hours when outdoors. Consider a follow-up professional chemical peel in 4 weeks if no improvement is noted.",
    notes: "Patient reports increased sun exposure over the last month. Suggesting strict UV protection protocol."
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#fbfcfd", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 500 }}
        >
          <ArrowLeft size={20} /> Back to Logs
        </button>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={secondaryBtnStyle}><Share2 size={18} /> Share</button>
          <button style={secondaryBtnStyle}><Download size={18} /> Export PDF</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", alignItems: "start" }}>
        
        {/* Left Column: Image Viewer */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Analysis Image</h2>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{scanDetails.id}</span>
          </div>
          <img 
            src={scanDetails.imageUrl} 
            alt="Skin Scan Analysis" 
            style={{ width: "100%", borderRadius: "12px", border: "1px solid #f1f5f9", display: "block" }} 
          />
          <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "13px", color: "#64748b", display: "flex", gap: "8px" }}>
            <AlertCircle size={16} style={{ color: "#3b82f6", flexShrink: 0 }} />
            AI-generated analysis is for informational purposes. Please consult a dermatologist for clinical diagnosis.
          </div>
        </div>

        {/* Right Column: Details & Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Status Card */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={24} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>Analysis Status</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#065f46" }}>Completed Successfully</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={infoRowStyle}>
                <span style={labelStyle}><User size={14} /> Patient</span>
                <span style={valueStyle}>{scanDetails.user}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={labelStyle}><Calendar size={14} /> Date</span>
                <span style={valueStyle}>{scanDetails.date}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={labelStyle}><Clock size={14} /> Time</span>
                <span style={valueStyle}>{scanDetails.time}</span>
              </div>
            </div>
          </div>

          {/* Clinical Findings */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#111827" }}>Findings</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Detected Condition</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1d4ed8" }}>{scanDetails.condition}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Accuracy</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>{scanDetails.accuracy}%</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Severity</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#f59e0b" }}>{scanDetails.severity}</div>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div style={{ ...cardStyle, backgroundColor: "#111827", color: "white" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ExternalLink size={18} /> Action Plan
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#d1d5db", margin: 0 }}>
              {scanDetails.recommendation}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Internal Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  padding: "24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #f1f5f9"
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  color: "#64748b"
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1e293b"
};

const secondaryBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#475569",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s"
};