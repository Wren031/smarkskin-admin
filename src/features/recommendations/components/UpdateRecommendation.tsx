import { useState, useEffect, type CSSProperties } from "react";
import { X, Edit3, Save, Package, ChevronDown, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { Products } from "../../products/types/Products";

type Props = {
  selected: any;
  onClose: () => void;
  onUpdate: (updated: any) => void;
};

export default function UpdateRecommendation({
  selected,
  onClose,
  onUpdate,
}: Props) {
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const [form, setForm] = useState({
    condition: "",
    severity: "",
    treatment: "",
    precautions: "",
    products: [] as Products[],
  });

  // Fetch all available products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("tbl_products").select("*");
      if (data) setAllProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selected) {
      setForm({
        condition: selected.condition?.name || selected.condition || "",
        severity: selected.severity || "",
        treatment: selected.treatment || "",
        precautions: selected.precautions || "",
        products: selected.products || [],
      });
    }
  }, [selected]);

  const isValid =
    form.condition.trim() !== "" &&
    form.severity.trim() !== "" &&
    form.treatment.trim() !== "" &&
    form.products.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onUpdate({ ...selected, ...form });
    onClose();
  };

  const addProduct = (productId: string) => {
    const product = allProducts.find((p) => p.id === Number(productId));
    if (product && !form.products.find((p) => p.id === product.id)) {
      setForm({ ...form, products: [...form.products, product] });
    }
  };

  const removeProduct = (id: number) => {
    setForm({ ...form, products: form.products.filter((p) => p.id !== id) });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .drawer-content { animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .product-item:hover { border-color: #e11d48 !important; }
      `}</style>

      <div className="drawer-content" style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <div style={styles.iconBox}><Edit3 size={20} /></div>
            <div>
              <h2 style={styles.title}>Update Protocol</h2>
              <p style={styles.subtitle}>MODIFY RECORD ID: {selected?.id}</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} style={styles.scrollArea}>
          
          <div style={styles.section}>
            <label style={styles.label}>TREATMENT PLAN</label>
            <textarea
              style={styles.textarea}
              value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>PRESCRIBED FORMULATIONS</label>
            
            {/* Product Selector */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <select
                style={styles.select}
                value=""
                onChange={(e) => addProduct(e.target.value)}
              >
                <option value="" disabled>Add pharmaceutical to protocol...</option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.product_name}</option>
                ))}
              </select>
              <ChevronDown size={14} style={styles.selectArrow} />
            </div>

            {/* Selected Products Grid */}
            <div style={styles.productGrid}>
              {form.products.map((product) => (
                <div key={product.id} className="product-item" style={styles.productCard}>
                  <img src={product.image_url} alt="" style={styles.productImage} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.pName}>{product.product_name}</div>
                    <div style={styles.pBrand}>{product.brand}</div>
                  </div>
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => removeProduct(product.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>SAFETY WARNINGS</label>
            <textarea
              style={{ ...styles.textarea, height: "100px", borderLeft: "4px solid #fca5a5" }}
              value={form.precautions}
              onChange={(e) => setForm({ ...form, precautions: e.target.value })}
            />
          </div>
        </form>

        {/* Actions */}
        <div style={styles.footer}>
          <button type="button" style={styles.secondaryBtn} onClick={onClose}>Discard Changes</button>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              ...styles.primaryBtn,
              backgroundColor: isValid ? "#0f172a" : "#f1f5f9",
              color: isValid ? "#fff" : "#94a3b8",
            }}
          >
            <Save size={16} /> Confirm Updates
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "flex-end" },
  drawer: { width: "100%", maxWidth: "500px", backgroundColor: "#fff", height: "100vh", display: "flex", flexDirection: "column", boxShadow: "-20px 0 50px rgba(0,0,0,0.1)" },
  header: { padding: "32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: { width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#f8fafc", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", marginTop: "4px" },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "32px" },
  section: { marginBottom: "32px" },
  label: { fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "10px", display: "block" },
  select: { width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", padding: "0 16px", fontSize: "14px", fontWeight: 500, outline: "none", appearance: "none" },
  selectArrow: { position: "absolute", right: "16px", top: "17px", color: "#94a3b8", pointerEvents: "none" },
  textarea: { width: "100%", height: "120px", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", lineHeight: "1.6", outline: "none", resize: "none" },
  productGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  productCard: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9", transition: "0.2s" },
  productImage: { width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" },
  pName: { fontSize: "13px", fontWeight: 700, color: "#0f172a" },
  pBrand: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 },
  removeBtn: { background: "#fff1f2", border: "none", color: "#e11d48", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  footer: { padding: "32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px" },
  primaryBtn: { flex: 2, height: "48px", borderRadius: "12px", border: "none", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  secondaryBtn: { flex: 1, height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "transparent", color: "#64748b", fontWeight: 600, cursor: "pointer" }
};