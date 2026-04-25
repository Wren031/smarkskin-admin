import React, { useState, useEffect, useMemo, useCallback } from "react";
import { X, Edit3, Save, Package, ChevronDown, Loader2, Lightbulb } from "lucide-react";
import { supabase } from "../../../lib/supabase";

// Types
import type { Products } from "../../products/types/Products";
import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";

type Props = {
  selected: any;
  onClose: () => void;
  onUpdate: (updated: any) => void;
};

export default function UpdateRecommendation({ selected, onClose, onUpdate }: Props) {
  // --- Data States ---
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const [allLifestyleTips, setAllLifestyleTips] = useState<LifestyleTip[]>([]);
  
  // --- UI States ---
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [form, setForm] = useState({
    condition: "",
    severity: "",
    treatment: "",
    precautions: "",
    products: [] as Products[],
    lifestyleTips: [] as LifestyleTip[],
  });

  // Entry Animation
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsAnimating(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fetch Metadata
  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, tipsRes] = await Promise.all([
        supabase.from("tbl_products").select("*").order('product_name'),
        supabase.from("tbl_lifestyle_tips").select("*").order('title'),
      ]);
      if (prodRes.data) setAllProducts(prodRes.data);
      if (tipsRes.data) setAllLifestyleTips(tipsRes.data);
    };
    fetchData();
  }, []);

  // Sync Form with Selected Record
  useEffect(() => {
    if (selected) {
      setForm({
        condition: selected.condition?.name || selected.condition || "",
        severity: selected.severity || "",
        treatment: selected.treatment || "",
        precautions: selected.precautions || "",
        products: selected.products || [],
        lifestyleTips: selected.lifestyleTips || [],
      });
    }
  }, [selected]);

  // --- Handlers ---
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const updateField = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Simulate/Handle update logic
      await onUpdate({ ...selected, ...form });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Validation ---
  const isFormValid = useMemo(() => (
    form.condition.trim() !== "" &&
    form.treatment.trim() !== "" &&
    (form.products.length > 0 || form.lifestyleTips.length > 0)
  ), [form]);

  return (
    <div 
      style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} 
      onClick={handleClose}
    >
      <div 
        style={{ 
          ...styles.drawer, 
          transform: isAnimating ? "translateX(0)" : "translateX(100%)" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Edit3 size={18} color="#0f172a" />
            </div>
            <div>
              <h2 style={styles.title}>Update Protocol</h2>
              <p style={styles.subtitle}>ID: {selected?.id} • {form.condition.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">
            <X size={14} />
          </button>
        </header>

        {/* BODY */}
        <form id="update-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* Section: Treatment */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Clinical Strategy</span>
              <div style={styles.secLine} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Instructions</label>
              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                value={form.treatment}
                onChange={(e) => updateField("treatment", e.target.value)}
                placeholder="Describe treatment steps..."
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Safety & Precautions</label>
              <textarea
                style={{ ...styles.input, ...styles.textarea, borderLeft: "4px solid #fca5a5" }}
                value={form.precautions}
                onChange={(e) => updateField("precautions", e.target.value)}
                placeholder="Warnings or side effects..."
              />
            </div>
          </section>

          {/* Section: Adjuncts */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Adjuncts & Prescriptions</span>
              <div style={styles.secLine} />
            </div>

            {/* Product Management */}
            <div style={styles.field}>
              <label style={styles.label}>Formulations</label>
              <div style={{ position: 'relative' }}>
                <select
                  style={{ ...styles.input, ...styles.select }}
                  value=""
                  onChange={(e) => {
                    const found = allProducts.find(p => String(p.id) === e.target.value);
                    if (found && !form.products.some(p => p.id === found.id)) {
                      updateField("products", [...form.products, found]);
                    }
                  }}
                >
                  <option value="">Add pharmaceutical...</option>
                  {allProducts.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                </select>
                <ChevronDown size={14} style={styles.selectArrow} />
              </div>

              <div style={styles.productGrid}>
                {form.products.map((p) => (
                  <div key={p.id} style={styles.productCard}>
                    <img 
                      src={p.image_url} 
                      alt="" 
                      style={styles.productThumb} 
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={styles.productName}>{p.product_name}</p>
                      <p style={styles.productType}>{p.type || 'Prescription'}</p>
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
            </div>

            {/* Lifestyle Management */}
            <div style={styles.field}>
              <label style={styles.label}>Lifestyle Tips</label>
              <select
                style={{ ...styles.input, ...styles.select }}
                value=""
                onChange={(e) => {
                  const found = allLifestyleTips.find(t => String(t.id) === e.target.value);
                  if (found && !form.lifestyleTips.some(t => t.id === found.id)) {
                    updateField("lifestyleTips", [...form.lifestyleTips, found]);
                  }
                }}
              >
                <option value="">Add lifestyle tip...</option>
                {allLifestyleTips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>

              <div style={styles.tagRow}>
                {form.lifestyleTips.map((t) => (
                  <div key={t.id} style={styles.tag}>
                    <Lightbulb size={12} />
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
            </div>
          </section>
        </form>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <button onClick={handleClose} style={styles.cancelBtn}>Discard Changes</button>
          <button
            type="submit"
            form="update-form"
            disabled={!isFormValid || isSubmitting}
            style={{ 
              ...styles.saveBtn, 
              backgroundColor: isFormValid ? "#0f172a" : "#f1f5f9",
              color: isFormValid ? "#fff" : "#94a3b8"
            }}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? "Updating..." : "Confirm Updates"}
          </button>
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
    width: "min(520px, 100vw)" as any,
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 50px rgba(0,0,0,0.1)",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: {
    padding: "24px 32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  badge: { width: 42, height: 42, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  subtitle: { fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", marginTop: 4 },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b", display: "flex" },
  body: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 28 },
  section: { display: "flex", flexDirection: "column", gap: 20 },
  secHead: { display: "flex", alignItems: "center", gap: 12 },
  secLabel: { fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  secLine: { flex: 1, height: "1px", background: "#f1f5f9" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 700, color: "#475569" },
  input: { width: "100%", padding: "12px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 12, outline: "none", transition: "border 0.2s" },
  select: { appearance: "none", cursor: "pointer", paddingRight: "40px" },
  selectArrow: { position: "absolute", right: "14px", top: "15px", color: "#94a3b8", pointerEvents: "none" },
  textarea: { height: "100px", resize: "none", lineHeight: "1.6" },
  productGrid: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
  productCard: { display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, position: "relative" },
  productThumb: { width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" },
  productName: { fontSize: "13px", fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  productType: { fontSize: "11px", color: "#94a3b8", fontWeight: 600, margin: 0 },
  removeCircle: { position: "absolute", top: "8px", right: "8px", border: "none", background: "#fff", color: "#e11d48", width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { padding: "6px 12px", background: "#f1f5f9", borderRadius: "20px", fontSize: "12px", fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 8 },
  tagRemove: { border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex" },
  footer: { padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px" },
  cancelBtn: { flex: 1, height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "transparent", color: "#64748b", fontWeight: 700, cursor: "pointer" },
  saveBtn: { flex: 2, height: "48px", borderRadius: "12px", border: "none", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: "0.2s" },
};