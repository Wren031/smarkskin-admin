import { useEffect, useState, type CSSProperties } from "react";
import { X, ClipboardList, ChevronDown, AlertCircle, Save } from "lucide-react";
import type { Recommendation } from "../types/Recommendation";
import { SEVERITY } from "../types/Severity";
import type { SkinCondition } from "../../condition/type/SkinCondition";
import type { Products } from "../../products/types/Products";
import { supabase } from "../../../lib/supabase";

interface Props {
  onAdd: (rec: Recommendation) => void;
  onCancel?: () => void;
}

export default function AddRecommendations({ onAdd, onCancel }: Props) {
  const [products, setProducts] = useState<Products[]>([]);
  const [conditions, setCondition] = useState<SkinCondition[]>([]);

  const [form, setForm] = useState({
    condition: null as SkinCondition | null,
    severity: SEVERITY.MILD,
    treatment: "",
    precautions: "",
    products: [] as Products[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cond }, { data: prod }] = await Promise.all([
        supabase.from("tbl_condition").select("*"),
        supabase.from("tbl_products").select("*"),
      ]);
      if (cond) setCondition(cond);
      if (prod) setProducts(prod);
    };
    fetchData();
  }, []);

  const isValid =
    form.condition !== null &&
    form.treatment.trim() !== "" &&
    form.precautions.trim() !== "" &&
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

    onAdd(newRecommendation);
  };

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .drawer-content { animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .form-input:focus { border-color: #0f172a !important; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05); }
      `}</style>

      <div className="drawer-content" style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <div style={styles.iconBox}><ClipboardList size={20} /></div>
            <div>
              <h2 style={styles.title}>New Protocol</h2>
              <p style={styles.subtitle}>CREATE AI TREATMENT RECOMMENDATION</p>
            </div>
          </div>
          <button onClick={onCancel} style={styles.closeBtn}><X size={20} /></button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} style={styles.scrollArea}>
          
          <div style={styles.section}>
            <label style={styles.label}>CLINICAL CONDITION & SEVERITY</label>
            <div style={styles.row}>
              <div style={{ position: 'relative', flex: 2 }}>
                <select
                  className="form-input"
                  style={styles.select}
                  value={form.condition?.id || ""}
                  onChange={(e) => {
                    const selected = conditions.find(c => c.id === Number(e.target.value));
                    if (selected) handleChange("condition", selected);
                  }}
                >
                  <option value="" disabled>Select Condition</option>
                  {conditions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} style={styles.selectArrow} />
              </div>

              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  className="form-input"
                  style={styles.select}
                  value={form.severity}
                  onChange={(e) => handleChange("severity", e.target.value)}
                >
                  {Object.values(SEVERITY).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} style={styles.selectArrow} />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>TREATMENT PROCEDURE</label>
            <textarea
              className="form-input"
              style={styles.textarea}
              placeholder="Step-by-step application instructions..."
              value={form.treatment}
              onChange={(e) => handleChange("treatment", e.target.value)}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>RISKS & PRECAUTIONS</label>
            <div style={{ position: 'relative' }}>
              <AlertCircle size={16} style={styles.textIcon} />
              <textarea
                className="form-input"
                style={{ ...styles.textarea, paddingLeft: "44px", height: "100px" }}
                placeholder="Identify potential side effects..."
                value={form.precautions}
                onChange={(e) => handleChange("precautions", e.target.value)}
              />
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>PHARMACEUTICAL PRODUCTS</label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <select
                className="form-input"
                style={styles.selectFull}
                value=""
                onChange={(e) => {
                  const selected = products.find((p) => p.id === Number(e.target.value));
                  if (selected && !form.products.some((p) => p.id === selected.id)) {
                    handleChange("products", [...form.products, selected]);
                  }
                }}
              >
                <option value="" disabled>Add product to protocol...</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>
              <ChevronDown size={14} style={styles.selectArrow} />
            </div>

            <div style={styles.productGrid}>
              {form.products.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <img src={product.image_url} alt="" style={styles.productImage} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.pName}>{product.product_name}</div>
                    <div style={styles.pBrand}>{product.brand}</div>
                  </div>
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => handleChange("products", form.products.filter((p) => p.id !== product.id))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <button type="button" style={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!isValid}
            style={{ 
              ...styles.primaryBtn, 
              backgroundColor: isValid ? "#0f172a" : "#f1f5f9",
              color: isValid ? "#fff" : "#94a3b8",
              cursor: isValid ? "pointer" : "not-allowed"
            }}
          >
            <Save size={16} /> Save Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end"
  },
  drawer: {
    width: "100%",
    maxWidth: "550px",
    backgroundColor: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 50px rgba(0,0,0,0.1)"
  },
  header: {
    padding: "32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: { 
    width: "44px", height: "44px", borderRadius: "12px", 
    backgroundColor: "#f8fafc", color: "#0f172a", 
    display: "flex", alignItems: "center", justifyContent: "center" 
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", marginTop: "4px" },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "32px" },
  section: { marginBottom: "28px" },
  label: { fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "10px", display: "block" },
  row: { display: "flex", gap: "12px" },
  select: { width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", padding: "0 16px", fontSize: "14px", fontWeight: 500, outline: "none", appearance: "none" },
  selectFull: { width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", padding: "0 16px", fontSize: "14px", fontWeight: 500, outline: "none", appearance: "none" },
  selectArrow: { position: "absolute", right: "16px", top: "17px", color: "#94a3b8", pointerEvents: "none" },
  textarea: { width: "100%", height: "120px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", padding: "16px", fontSize: "14px", lineHeight: "1.6", resize: "none", outline: "none" },
  textIcon: { position: "absolute", left: "16px", top: "16px", color: "#94a3b8" },
  productGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  productCard: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9", backgroundColor: "#fff" },
  productImage: { width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" },
  pName: { fontSize: "13px", fontWeight: 700, color: "#0f172a" },
  pBrand: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 },
  removeBtn: { background: "#fff1f2", border: "none", color: "#e11d48", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  footer: { padding: "32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px" },
  primaryBtn: { flex: 2, height: "48px", borderRadius: "12px", fontWeight: 700, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" },
  secondaryBtn: { flex: 1, height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "transparent", color: "#64748b", fontWeight: 600, cursor: "pointer" }
};