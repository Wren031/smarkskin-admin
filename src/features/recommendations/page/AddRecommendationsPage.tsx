import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

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

      if (cond) setConditions(cond);
      if (prod) setProducts(prod);
    };

    fetchData();
  }, []);

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
      <div style={styles.container}>
        <div style={styles.header}>


        <TitleSize
          title="Add Recommendation"
          subtitle="Create a treatment plan for a specific condition"
        />

        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* LEFT */}
            <div>
              <label style={styles.label}>Condition & Severity</label>
              <div style={styles.row}>
                <select
                  style={styles.input}
                  value={form.condition?.id || ""}
                  onChange={(e) => {
                    const selected = conditions.find(
                      (c) => c.id === Number(e.target.value)
                    );
                    if (selected) handleChange("condition", selected);
                  }}
                >
                  <option value="" disabled>Select Condition</option>
                  {conditions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  style={{ ...styles.input, width: "140px", flex: "none" }}
                  value={form.severity}
                  onChange={(e) => handleChange("severity", e.target.value)}
                >
                  {Object.values(SEVERITY).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <label style={styles.label}>Treatment Plan</label>
              <textarea
                style={styles.textarea}
                placeholder="Describe the treatment process..."
                value={form.treatment}
                onChange={(e) => handleChange("treatment", e.target.value)}
              />

              <label style={styles.label}>Precautions</label>
              <textarea
                style={styles.textarea}
                placeholder="Any side effects or safety notes..."
                value={form.precautions}
                onChange={(e) => handleChange("precautions", e.target.value)}
              />
            </div>

            {/* RIGHT */}
            <div>
              <label style={styles.label}>Select Products</label>
              <select
                style={styles.inputFull}
                onChange={(e) => {
                  const selected = products.find(
                    (p) => p.id === Number(e.target.value)
                  );

                  if (
                    selected &&
                    !form.products.some((p) => p.id === selected.id)
                  ) {
                    handleChange("products", [...form.products, selected]);
                  }
                }}
              >
                <option value="" disabled selected>Search for products...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name}
                  </option>
                ))}
              </select>

              <p style={styles.smallTitle}>
                Products Selected ({form.products.length})
              </p>

              <div style={styles.productList}>
                {form.products.length === 0 && (
                  <div style={styles.emptyState}>No products added yet</div>
                )}
                {form.products.map((p) => (
                  <div key={p.id} style={styles.productRow}>
                    <div style={styles.imagePlaceholder} />

                    <div style={{ flex: 1 }}>
                      <div style={styles.productName}>{p.product_name}</div>
                      <div style={styles.productDesc}>{p.brand || "Standard Brand"}</div>
                    </div>

                    <div style={styles.priceContainer}>
                      <span style={styles.price}>₱{p.price || "0.00"}</span>
                      <button
                        style={styles.removeBtn}
                        onClick={() =>
                          handleChange(
                            "products",
                            form.products.filter((item) => item.id !== p.id)
                          )
                        }
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button 
              style={{ 
                ...styles.saveBtn, 
                backgroundColor: isValid ? "#0F172A" : "#94A3B8",
                cursor: isValid ? "pointer" : "not-allowed"
              }} 
              disabled={!isValid}
            >
              Save Recommendation
            </button>

            <button
              type="button"
              style={styles.linkBtn}
              onClick={() => navigate("/recommendation")}
            >
              Cancel and Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { 
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "1500px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",

  },
  header: {
    marginBottom: "32px",
    borderBottom: "1px solid #F1F5F9",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0F172A",
    margin: 0,
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748B",
    marginTop: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "48px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "8px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: "0 12px",
    fontSize: "14px",
    color: "#1E293B",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputFull: {
    width: "100%",
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: "0 12px",
    marginBottom: "24px",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    height: "120px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    marginBottom: "24px",
    padding: "12px",
    fontSize: "14px",
    lineHeight: "1.6",
    resize: "none",
    outline: "none",
  },
  smallTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#94A3B8",
    marginBottom: "12px",
    textTransform: "uppercase",
  },
  productList: {
    border: "1px solid #F1F5F9",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: "14px",
  },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 16px",
    borderBottom: "1px solid #F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  imagePlaceholder: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    background: "#F1F5F9",
    border: "1px solid #E2E8F0",
  },
  productName: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#1E293B",
  },
  productDesc: {
    fontSize: "12px",
    color: "#64748B",
    marginTop: "2px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  price: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0F172A",
  },
  removeBtn: {
    background: "#FEE2E2",
    color: "#EF4444",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  actions: {
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px solid #F1F5F9",
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  saveBtn: {
    color: "#FFFFFF",
    border: "none",
    padding: "12px 32px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.2s",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#64748B",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.2s",
  },
};