import { type CSSProperties, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recommendation as recommendationData } from "../data/recommendations";
import type { Recommendation } from "../types/Recommendation";

export default function EditableRecommendationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Find initial data
  const initialData = useMemo(() => {
    return recommendationData.find((item) => item.id === Number(id));
  }, [id]);

  // 2. State for Edit Mode and Form Data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Recommendation | undefined>(initialData);

  if (!formData) return <div style={styles.page}>Loading...</div>;

  const handleInputChange = (key: keyof Recommendation, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    // Here you would typically perform an API call (e.g., fetch PUT/PATCH)
    console.log("Saving data:", formData);
    setIsEditing(false);
  };

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.mainTitle}>Recommendation Overview</h1>
          <p style={styles.dateSubtext}>Created At: {formData.createdAt}</p>
        </div>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)} 
          style={isEditing ? styles.saveButton : styles.editButtonTop}
        >
          {isEditing ? "Save Changes" : "Edit Entry"}
        </button>
      </header>

      <hr style={styles.divider} />

      {/* ===== CONTENT ===== */}
      <div style={styles.layoutGrid}>
        
        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>
          <div style={styles.idBadge}>ID: fk2502412-21{formData.id}</div>
          
          <section style={styles.sectionGroup}>
            <h3 style={styles.sectionTitle}>General Information</h3>
            <div style={styles.infoRowGrid}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Condition</span>
                {isEditing ? (
                  <input 
                    style={styles.inputInline} 
                    value={formData.condition} 
                    onChange={(e) => handleInputChange("condition", e.target.value)}
                  />
                ) : (
                  <span style={styles.infoValue}>{formData.condition}</span>
                )}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Severity</span>
                {isEditing ? (
                  <select 
                    style={styles.inputInline} 
                    value={formData.severity} 
                    onChange={(e) => handleInputChange("severity", e.target.value)}
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                ) : (
                  <span style={styles.infoValue}>{formData.severity}</span>
                )}
              </div>
            </div>
          </section>

          <section style={styles.sectionGroup}>
            <h3 style={styles.sectionTitle}>Care Plan</h3>
            <div style={styles.carePlanBox}>
               <label style={styles.careLabel}>Treatment</label>
               {isEditing ? (
                 <textarea 
                    style={styles.textarea} 
                    value={formData.treatment} 
                    onChange={(e) => handleInputChange("treatment", e.target.value)}
                 />
               ) : (
                 <div style={styles.careContent}>{formData.treatment}</div>
               )}
            </div>
            <div style={styles.carePlanBox}>
               <label style={styles.careLabel}>Precautions</label>
               {isEditing ? (
                 <textarea 
                    style={styles.textarea} 
                    value={formData.precautions} 
                    onChange={(e) => handleInputChange("precautions", e.target.value)}
                 />
               ) : (
                 <div style={styles.careContent}>{formData.precautions}</div>
               )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>
          <h3 style={styles.sectionTitle}>Product Recommendation Treatment</h3>
          <div style={styles.productFlex}>
            {formData.products?.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.imageContainer}>
                   <img src={product.image_url} alt={product.product_name} style={styles.productImage} />
                </div>
                <p style={styles.productNameText}>{product.product_name}</p>
                {isEditing && (
                  <button style={styles.removeBtn}>Remove</button>
                )}
              </div>
            ))}
            {isEditing && (
              <div style={styles.addCard}>+ Add Product</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, CSSProperties> = {
  page: {backgroundColor: "#ffffff", fontFamily: "Inter, sans-serif"},
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  mainTitle: { fontSize: "28px", fontWeight: "bold", margin: 0 },
  dateSubtext: { color: "#9ca3af", fontSize: "14px" },
  editButtonTop: { backgroundColor: "#000", color: "#fff", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" },
  saveButton: { backgroundColor: "#10b981", color: "#fff", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  divider: { border: "none", borderTop: "1px solid #eee", margin: "20px 0 40px 0" },
  layoutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" },
  leftCol: { display: "flex", flexDirection: "column", gap: "30px" },
  idBadge: { backgroundColor: "#e5e7eb", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", width: "fit-content" },
  sectionTitle: { fontSize: "16px", fontWeight: "bold", marginBottom: "15px" },
  infoRowGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  infoBox: { border: "1px solid #e5e7eb", borderRadius: "6px", display: "flex", padding: "8px 12px", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { color: "#9ca3af", fontSize: "13px" },
  infoValue: { fontWeight: "bold", fontSize: "13px" },
  inputInline: { border: "1px solid #3b82f6", borderRadius: "4px", padding: "4px", fontSize: "13px", textAlign: "right", outline: "none" },
  careLabel: { fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px" },
  careContent: { border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px", minHeight: "100px", fontSize: "14px" },
  textarea: { border: "1px solid #3b82f6", borderRadius: "8px", padding: "15px", minHeight: "100px", width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" },
  productFlex: { display: "flex", gap: "20px", flexWrap: "wrap", backgroundColor: "#f9fafb", padding: "20px", borderRadius: "12px" },
  productCard: { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", width: "160px", textAlign: "center", position: "relative" },
  imageContainer: { height: "100px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  productImage: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" },
  productNameText: { fontSize: "12px", color: "#1e3a8a", fontWeight: "500" },
  removeBtn: { marginTop: "10px", color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", textDecoration: "underline" },
  addCard: { width: "160px", height: "160px", border: "2px dashed #d1d5db", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }
};