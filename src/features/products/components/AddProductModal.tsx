import React, { useState, useEffect, useCallback } from "react";
import { X, Plus, Package, CloudUpload, Loader2, DollarSign, Info, Activity } from "lucide-react";
import type { CSSProperties, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { productServices } from "../services/productServices";
import type { Products } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Products, "id" | "created_at">) => Promise<void>;
}

export default function AddProductDrawer({ isOpen, onClose, onSave }: Props) {
  const initialForm: Omit<Products, "id" | "created_at"> = {
    product_name: "",
    type: "",
    usage: "",
    instructions: "",
    price: 0,
    image_url: "",
    lifestyle_tips: false
  };

  // --- States ---
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Lifecycle & Animation ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "unset";
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setForm(initialForm);
        setPreview("");
        setFile(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // --- Handlers ---
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === "price" ? (parseFloat(value) || 0) : value 
    }));
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name.trim()) return toast.error("Product name is required");
    if (!form.type.trim()) return toast.error("Brand classification is required");
    if (!form.usage) return toast.error("Usage routine is required");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Syncing with inventory...");

    try {
      let imageUrl = "";
      if (file) {
        const uploaded = await productServices.uploadImage(file);
        if (uploaded) imageUrl = uploaded;
      }

      await onSave({ ...form, image_url: imageUrl });
      toast.success("Product listed successfully", { id: loadingToast });
      handleClose();
    } catch (err) {
      toast.error("Failed to update inventory", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

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
            <div style={styles.badge}><Plus size={18} color="#0f172a" /></div>
            <div>
              <h2 style={styles.title}>Add New Product</h2>
              <p style={styles.subtitle}>INVENTORY MANAGEMENT • SKU: NEW</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn}><X size={14} /></button>
        </header>

        {/* BODY */}
        <form id="product-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* IDENTIFICATION SECTION */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Identification</span>
              <div style={styles.secLine} />
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}><Package size={12} /> Product Name</label>
              <input 
                name="product_name" 
                value={form.product_name} 
                onChange={handleChange} 
                style={styles.input} 
                placeholder="e.g. Ceramide Hydrating Cream" 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Info size={12} /> Brand / Type</label>
              <input 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                style={styles.input} 
                placeholder="e.g. SkinCeuticals" 
              />
            </div>
          </section>

          {/* APPLICATION SECTION */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Application Protocols</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Activity size={12} /> Usage Routine</label>
              <select name="usage" value={form.usage} onChange={handleChange} style={{...styles.input, ...styles.select}}>
                <option value="">Select Routine Target...</option>
                <option value="Morning Routine">Morning Routine</option>
                <option value="Evening Routine">Evening Routine</option>
                <option value="Both">Both (AM/PM)</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Clinical Instructions</label>
              <textarea 
                name="instructions" 
                value={form.instructions} 
                onChange={handleChange} 
                style={{...styles.input, ...styles.textarea}} 
                placeholder="Specify dosage and application steps..." 
              />
            </div>
          </section>

          {/* COMMERCE SECTION */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Commerce & Media</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><DollarSign size={12} /> MSRP (PHP)</label>
              <input 
                type="number" 
                name="price" 
                value={form.price || ""} 
                onChange={handleChange} 
                style={styles.input} 
                placeholder="0.00" 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Product Asset</label>
              <div style={styles.uploadArea}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="product-upload" />
                <label htmlFor="product-upload" style={styles.uploadLabel}>
                  <CloudUpload size={20} color="#6366f1" />
                  {preview ? "Replace Asset" : "Upload Product Image"}
                </label>
              </div>
              {preview && (
                <div style={styles.previewContainer}>
                  <img src={preview} alt="Asset Preview" style={styles.preview} />
                  <button type="button" onClick={() => {setPreview(""); setFile(null)}} style={styles.removeImage}>
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          </section>
        </form>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <button type="button" style={styles.cancelBtn} onClick={handleClose}>Discard</button>
          <button 
            type="submit" 
            form="product-form"
            disabled={isSubmitting} 
            style={{ 
              ...styles.saveBtn,
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {isSubmitting ? "Creating SKU..." : "Create Product"}
          </button>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
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
    width: "min(480px, 100vw)" as any,
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
  badge: { 
    width: 40, height: 40, borderRadius: 12, background: "#f8fafc", 
    border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" 
  },
  title: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  subtitle: { fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", marginTop: 4 },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b", display: "flex" },
  body: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 28 },
  section: { display: "flex", flexDirection: "column", gap: 18 },
  secHead: { display: "flex", alignItems: "center", gap: 12 },
  secLabel: { fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  secLine: { flex: 1, height: "1px", background: "#f1f5f9" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 6 },
  input: { 
    width: "100%", padding: "12px", fontSize: 14, border: "1px solid #e2e8f0", 
    borderRadius: 12, outline: "none", background: "#fcfcfd" 
  },
  select: { 
    appearance: "none", cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center"
  },
  textarea: { height: "90px", resize: "none", lineHeight: "1.6" },
  uploadArea: { border: "2px dashed #e2e8f0", borderRadius: "12px", padding: "24px", textAlign: "center", cursor: "pointer", background: "#f8fafc" },
  uploadLabel: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#6366f1", cursor: "pointer" },
  previewContainer: { marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", position: "relative" },
  preview: { width: "100%", height: "160px", objectFit: "cover" },
  removeImage: { position: "absolute", top: 8, right: 8, background: "#fff", border: "none", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  footer: { padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px", background: "#fff" },
  cancelBtn: { flex: 1, height: "48px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 700, cursor: "pointer" },
  saveBtn: { flex: 2, height: "48px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer" },
};