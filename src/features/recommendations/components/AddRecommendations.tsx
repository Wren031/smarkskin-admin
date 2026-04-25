import React, { useEffect, useState, useMemo, useCallback } from "react";
import { X, ClipboardList, Save, Package, Loader2, Lightbulb } from "lucide-react";
import { supabase } from "../../../lib/supabase";

// Types
import type { Recommendation } from "../types/Recommendation";
import type { Severity } from "../types/Severity";
import { SEVERITY } from "../types/Severity";
import type { SkinCondition } from "../../condition/type/SkinCondition";
import type { Products } from "../../products/types/Products";
import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";

interface Props {
  onAdd: (rec: Recommendation) => void;
  onCancel: () => void;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; activeStyle: React.CSSProperties }> = {
  [SEVERITY.MILD]: {
    label: "Mild",
    activeStyle: { background: "#EAF3DE", borderColor: "#639922", color: "#3B6D11" },
  },
  [SEVERITY.MODERATE]: {
    label: "Moderate",
    activeStyle: { background: "#FAEEDA", borderColor: "#BA7517", color: "#854F0B" },
  },
  [SEVERITY.SEVERE]: {
    label: "Severe",
    activeStyle: { background: "#FCEBEB", borderColor: "#E24B4A", color: "#A32D2D" },
  },
};

const SectionHeader = React.memo(({ label }: { label: string }) => (
  <div style={styles.secHead}>
    <span style={styles.secLabel}>{label}</span>
    <div style={styles.secLine} />
  </div>
));

export default function AddRecommendations({ onAdd, onCancel }: Props) {
  // Data State
  const [data, setData] = useState({
    products: [] as Products[],
    conditions: [] as SkinCondition[],
    lifestyleTips: [] as LifestyleTip[],
  });

  // UI State
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    condition: null as SkinCondition | null,
    severity: SEVERITY.MILD as Severity,
    treatment: "",
    precautions: "",
    products: [] as Products[],
    lifestyleTips: [] as LifestyleTip[],
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsAnimating(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [cond, prod, tips] = await Promise.all([
        supabase.from("tbl_condition").select("*").order('name'),
        supabase.from("tbl_products").select("*").order('product_name'),
        supabase.from("tbl_lifestyle_tips").select("*").order('title'),
      ]);
      setData({
        conditions: cond.data || [],
        products: prod.data || [],
        lifestyleTips: tips.data || [],
      });
    };
    fetchData();
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onCancel, 300);
  }, [onCancel]);

  const updateField = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = useMemo(() => (
    !!form.condition &&
    form.treatment.trim().length > 0 &&
    form.precautions.trim().length > 0 &&
    (form.products.length > 0 || form.lifestyleTips.length > 0)
  ), [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      onAdd({
        id: Date.now(),
        ...form,
        condition: form.condition!,
        createdAt: new Date().toISOString(),
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} onClick={handleClose}>
      <div 
        style={{ ...styles.drawer, transform: isAnimating ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}><ClipboardList size={18} color="#6b7280" /></div>
            <div>
              <h2 style={styles.title}>New Protocol</h2>
              <p style={styles.subtitle}>AI CLINICAL RECOMMENDATION</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn}><X size={14} /></button>
        </header>

        {/* BODY */}
        <form id="protocol-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* DIAGNOSIS */}
          <section style={styles.section}>
            <SectionHeader label="Diagnosis" />
            <div style={styles.row2}>
              <div style={styles.field}>
                <label style={styles.label}>Condition</label>
                <select
                  style={{ ...styles.input, ...styles.select }}
                  value={form.condition?.id ?? ""}
                  onChange={(e) => {
                    const found = data.conditions.find(c => c.id === Number(e.target.value));
                    updateField("condition", found || null);
                  }}
                >
                  <option value="">Select condition...</option>
                  {data.conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Severity</label>
                <div style={styles.severityRow}>
                  {(Object.values(SEVERITY) as Severity[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateField("severity", s)}
                      style={{ ...styles.severityBtn, ...(form.severity === s ? SEVERITY_CONFIG[s].activeStyle : {}) }}
                    >
                      {SEVERITY_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* TREATMENT */}
          <section style={styles.section}>
            <SectionHeader label="Treatment Plan" />
            <div style={styles.field}>
              <label style={styles.label}>Therapeutic Instructions</label>
              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                placeholder="Recommended treatment steps..."
                value={form.treatment}
                onChange={(e) => updateField("treatment", e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Precautions</label>
              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                placeholder="Side effects or warnings..."
                value={form.precautions}
                onChange={(e) => updateField("precautions", e.target.value)}
              />
            </div>
          </section>

          {/* ADJUNCTS (Products & Lifestyle) */}
          <section style={styles.section}>
            <SectionHeader label="Adjuncts" />
            
            {/* Products with Image Handling */}
            <div style={styles.field}>
              <label style={styles.label}>Recommended Products</label>
              <select
                style={{ ...styles.input, ...styles.select }}
                value=""
                onChange={(e) => {
                  const found = data.products.find(p => String(p.id) === e.target.value);
                  if (found && !form.products.some(p => p.id === found.id)) {
                    updateField("products", [...form.products, found]);
                  }
                }}
              >
                <option value="">Add product...</option>
                {data.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>

              {form.products.length > 0 && (
                <div style={styles.productGrid}>
                  {form.products.map((p) => (
                    <div key={p.id} style={styles.productCard}>
                      {p.image_url ? (
                        <img 
                          src={p.image_url} 
                          alt="" 
                          style={styles.productThumb}
                          onError={(e) => (e.currentTarget.style.display = "none")} 
                        />
                      ) : (
                        <div style={styles.productPlaceholder}><Package size={14} color="#94a3b8" /></div>
                      )}
                      <div style={styles.productInfo}>
                        <p style={styles.productName}>{p.product_name}</p>
                        <p style={styles.productType}>{p.type || 'Treatment'}</p>
                      </div>
                      <button 
                        type="button" 
                        style={styles.removeCircle} 
                        onClick={() => updateField("products", form.products.filter(x => x.id !== p.id))}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lifestyle Tips */}
            <div style={styles.field}>
              <label style={styles.label}>Lifestyle Tips</label>
              <select
                style={{ ...styles.input, ...styles.select }}
                value=""
                onChange={(e) => {
                  const found = data.lifestyleTips.find(t => String(t.id) === e.target.value);
                  if (found && !form.lifestyleTips.some(t => t.id === found.id)) {
                    updateField("lifestyleTips", [...form.lifestyleTips, found]);
                  }
                }}
              >
                <option value="">Add lifestyle tip...</option>
                {data.lifestyleTips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>

              {form.lifestyleTips.length > 0 && (
                <div style={styles.tagRow}>
                  {form.lifestyleTips.map((t) => (
                    <div key={t.id} style={styles.tag}>
                      <Lightbulb size={12} color="#64748b" />
                      {t.title}
                      <button 
                        type="button" 
                        style={styles.tagRemove}
                        onClick={() => updateField("lifestyleTips", form.lifestyleTips.filter(x => x.id !== t.id))}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </form>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <p style={styles.footerNote}>* Mandatory: Condition and Treatment</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleClose} style={styles.cancelBtn}>Cancel</button>
            <button
              type="submit"
              form="protocol-form"
              disabled={!isFormValid || isSubmitting}
              style={{ ...styles.saveBtn, opacity: isFormValid ? 1 : 0.4 }}
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSubmitting ? "Saving..." : "Save Protocol"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end",
    transition: "opacity 0.3s ease-out",
  },
  drawer: {
    width: "min(540px, 100vw)" as any,
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: {
    padding: "20px 28px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  badge: { width: 38, height: 38, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, fontWeight: 600, color: "#1e293b", margin: 0 },
  subtitle: { fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginTop: 2 },
  closeBtn: { width: 28, height: 28, border: "1px solid #e2e8f0", background: "none", borderRadius: 8, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" },
  body: { flex: 1, overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column", gap: 28 },
  section: { display: "flex", flexDirection: "column", gap: 16 },
  secHead: { display: "flex", alignItems: "center", gap: 10 },
  secLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" },
  secLine: { flex: 1, height: "1px", background: "#f1f5f9" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "#475569" },
  input: { width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none" },
  select: { appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" },
  textarea: { height: 80, resize: "none", lineHeight: 1.5 },
  severityRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 },
  severityBtn: { padding: "8px", fontSize: 12, fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#64748b", cursor: "pointer" },
  productGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 },
  productCard: { display: "flex", alignItems: "center", gap: 10, padding: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, position: "relative" },
  productThumb: { width: 36, height: 36, borderRadius: 6, objectFit: "cover", border: "1px solid #e2e8f0" },
  productPlaceholder: { width: 36, height: 36, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontSize: 12, fontWeight: 600, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  productType: { fontSize: 11, color: "#94a3b8", margin: 0 },
  removeCircle: { position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { padding: "6px 10px", background: "#f1f5f9", borderRadius: 20, fontSize: 12, fontWeight: 500, color: "#475569", display: "flex", alignItems: "center", gap: 6 },
  tagRemove: { border: "none", background: "none", cursor: "pointer", padding: 2, display: "flex", color: "#94a3b8" },
  footer: { padding: "20px 28px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerNote: { fontSize: 11, color: "#94a3b8", fontStyle: "italic" },
  cancelBtn: { padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" },
  saveBtn: { padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#0f172a", border: "none", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
};