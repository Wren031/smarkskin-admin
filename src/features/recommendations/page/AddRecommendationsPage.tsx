import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  ClipboardList,
  Package
} from "lucide-react";

import type { Recommendation } from "../types/Recommendation";
import { SEVERITY } from "../types/Severity";
import type { SkinCondition } from "../../condition/type/SkinCondition";
import type { Products } from "../../products/types/Products";

import { supabase } from "../../../lib/supabase";
import useRecommendations from "../hooks/useRecommendations";
import TitleSize from "../../../styles/TitleSize";

export default function AddRecommendationsPage() {
  const navigate = useNavigate();
  const { handleAdd } = useRecommendations();

  const [products, setProducts] = useState<Products[]>([]);
  const [conditions, setConditions] = useState<SkinCondition[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    
    const fetchData = async () => {
      const [{ data: cond }, { data: prod }] = await Promise.all([
        supabase.from("tbl_condition").select("*"),
        supabase.from("tbl_products").select("*"),
      ]);
      if (cond) setConditions(cond);
      if (prod) setProducts(prod);
    };

    fetchData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [form, setForm] = useState({
    condition: null as SkinCondition | null,
    severity: SEVERITY.MILD,
    treatment: "",
    precautions: "",
    products: [] as Products[],
  });

  const isValid =
    form.condition &&
    form.treatment.trim() &&
    form.precautions.trim() &&
    form.products.length > 0;

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !form.condition) return;

    const newRecommendation: Recommendation = {
      id: Date.now(),
      condition: form.condition,
      severity: form.severity,
      treatment: form.treatment,
      precautions: form.precautions,
      products: form.products,
      createdAt: new Date().toISOString(),
    };

    handleAdd(newRecommendation);
    navigate("/recommendation");
  };

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.container,
        padding: isMobile ? "20px" : "40px 60px",
      }}>
        
        {/* TOP BAR / NAVIGATION */}
        <div style={styles.breadcrumb}>
          <span>Recommendations</span>
          <ChevronRight size={14} />
          <span style={{ color: "#000", fontWeight: 600 }}>Create New</span>
        </div>

        <div style={styles.header}>
          <TitleSize
            title="Recommendation Protocol"
            subtitle="Draft a clinical-grade treatment plan and select compatible pharmaceutical products."
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            ...styles.grid,
            gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
            gap: isMobile ? "32px" : "80px"
          }}>
            
            {/* LEFT COLUMN: DOCUMENTATION */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <ClipboardList size={18} />
                <h3 style={styles.sectionTitle}>Treatment Documentation</h3>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Clinical Condition & Severity</label>
                <div style={{
                  ...styles.row,
                  flexDirection: window.innerWidth < 480 ? "column" : "row"
                }}>
                  <select
                    style={styles.select}
                    value={form.condition?.id || ""}
                    onChange={(e) => {
                      const selected = conditions.find(c => c.id === Number(e.target.value));
                      if (selected) handleChange("condition", selected);
                    }}
                  >
                    <option value="" disabled>Select Skin Condition</option>
                    {conditions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    style={{ ...styles.select, width: isMobile ? "100%" : "160px" }}
                    value={form.severity}
                    onChange={(e) => handleChange("severity", e.target.value)}
                  >
                    {Object.values(SEVERITY).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Treatment Procedure</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Step-by-step application instructions..."
                  value={form.treatment}
                  onChange={(e) => handleChange("treatment", e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Risk & Contraindications</label>
                <div style={styles.textAreaWrapper}>
                  <AlertCircle size={16} style={styles.textIcon} />
                  <textarea
                    style={{...styles.textarea, paddingLeft: "40px", marginBottom: 0}}
                    placeholder="Identify potential side effects or safety warnings..."
                    value={form.precautions}
                    onChange={(e) => handleChange("precautions", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT SELECTION */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <Package size={18} />
                <h3 style={styles.sectionTitle}>Product Prescription</h3>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Inventory Lookup</label>
                <div style={styles.searchWrapper}>
                  <select
                    style={styles.selectFull}
                    value=""
                    onChange={(e) => {
                      const selected = products.find((p) => p.id === Number(e.target.value));
                      if (selected && !form.products.some((p) => p.id === selected.id)) {
                        handleChange("products", [...form.products, selected]);
                      }
                    }}
                  >
                    <option value="" disabled>Search products to add...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.product_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.productList}>
                {form.products.length === 0 ? (
                  <div style={styles.emptyState}>No products assigned.</div>
                ) : (
                  form.products.map((p) => (
                    <div key={p.id} style={styles.productCard}>
                      <div style={styles.productInfo}>
                        <span style={styles.productName}>{p.product_name}</span>
                        <span style={styles.productBrand}>{p.brand || "Standard"}</span>
                      </div>
                      <div style={styles.productActions}>
                        <span style={styles.price}>₱{p.price || "0.00"}</span>
                        <button
                          style={styles.iconRemove}
                          onClick={() => handleChange("products", form.products.filter((item) => item.id !== p.id))}
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div style={styles.footer}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/recommendation")}
            >
              Discard Changes
            </button>
            <button 
              style={{ 
                ...styles.submitBtn, 
                backgroundColor: isValid ? "#000000" : "#F3F4F6",
                color: isValid ? "#FFFFFF" : "#9CA3AF",
                cursor: isValid ? "pointer" : "not-allowed"
              }} 
              disabled={!isValid}
            >
              <Save size={16} />
              Finalize Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { 
    fontFamily: "'Inter', system-ui, sans-serif",
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  container: {

    margin: "0 auto",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "24px",
  },
  header: {
    marginBottom: "56px",
  },
  grid: {
    display: "grid",
  },
  section: {
    display: "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    margin: 0,
  },
  formGroup: {
    marginBottom: "28px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "8px",
    display: "block",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  select: {
    flex: 1,
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    padding: "0 12px",
    fontSize: "14px",
    outline: "none",
    appearance: "none",
  },
  selectFull: {
    width: "100%",
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    padding: "0 12px",
    fontSize: "14px",
    outline: "none",
  },
  textAreaWrapper: {
    position: "relative",
  },
  textIcon: {
    position: "absolute",
    left: "14px",
    top: "14px",
    color: "#9CA3AF",
  },
  textarea: {
    width: "100%",
    height: "140px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    padding: "14px",
    fontSize: "14px",
    lineHeight: "1.5",
    resize: "none",
    outline: "none",
    transition: "border-color 0.2s",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: "14px",
    border: "1px dashed #E5E7EB",
    borderRadius: "12px",
  },
  productCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    transition: "transform 0.1s",
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontSize: "14px",
    fontWeight: 600,
  },
  productBrand: {
    fontSize: "12px",
    color: "#6B7280",
  },
  productActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  price: {
    fontSize: "14px",
    fontWeight: 500,
  },
  iconRemove: {
    background: "none",
    border: "none",
    color: "#9CA3AF",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: "60px",
    paddingTop: "32px",
    borderTop: "1px solid #F3F4F6",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.2s",
  },
  cancelBtn: {
    background: "transparent",
    border: "none",
    color: "#6B7280",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
};