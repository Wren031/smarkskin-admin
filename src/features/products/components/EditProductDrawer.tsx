import React, { useState, useEffect, useMemo, useCallback } from "react";
import { X, Edit3, Package, CloudUpload, Loader2, DollarSign, Info, Activity } from "lucide-react";
import type { CSSProperties, ChangeEvent } from "react";
import type { Products } from "../types/Products";
import toast from "react-hot-toast";
import { productServices } from "../services/productServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Products | null;
  onUpdate: (product: Products) => Promise<void>;
}

export default function EditProductDrawer({ isOpen, onClose, product, onUpdate }: Props) {
  // --- States ---
  const [form, setForm] = useState<Products | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Lifecycle & Animation Sync ---
  useEffect(() => {
    if (product && isOpen) {
      setForm(product);
      setPreview(product.image_url || "");
      setFile(null);
      // Trigger entry animation
      const frame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
    }
  }, [product, isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for slide-out
  }, [onClose]);

  // --- Input Handlers ---
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "price" ? (parseFloat(value) || 0) : value,
      };
    });
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
    if (!form || !form.product_name.trim()) return toast.error("Product name is required");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating product records...");

    try {
      let finalImageUrl = form.image_url;
      if (file) {
        const uploadedUrl = await productServices.uploadImage(file);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      await onUpdate({ ...form, image_url: finalImageUrl });
      toast.success("SKU updated successfully", { id: loadingToast });
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
            <div style={styles.badge}>
              <Edit3 size={18} color="#0f172a" />
            </div>
            <div>
              <h2 style={styles.title}>Edit Product</h2>
              <p style={styles.subtitle}>MODIFY SKU: {product?.id || 'N/A'}</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">
            <X size={14} />
          </button>
        </header>

        {/* BODY */}
        <form id="edit-product-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* Section: Basic Info */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Product Identity</span>
              <div style={styles.secLine} />
            </div>
            
            <div style={styles.field}>
              <label style={styles.label}><Package size={12} /> Product Name</label>
              <input 
                name="product_name" 
                value={form?.product_name || ""} 
                onChange={handleChange} 
                style={styles.input} 
                placeholder="Name" 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Info size={12} /> Brand Classification</label>
              <input 
                name="type" 
                value={form?.type || ""} 
                onChange={handleChange} 
                style={styles.input} 
                placeholder="Brand" 
              />
            </div>
          </section>

          {/* Section: Directions */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Usage Protocol</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Activity size={12} /> Routine Category</label>
              <select name="usage" value={form?.usage || ""} onChange={handleChange} style={{...styles.input, ...styles.select}}>
                <option value="Morning Routine">Morning Routine</option>
                <option value="Evening Routine">Evening Routine</option>
                <option value="Both">Both (Morning & Evening)</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Detailed Instructions</label>
              <textarea 
                name="instructions" 
                value={form?.instructions || ""} 
                onChange={handleChange} 
                style={{...styles.input, ...styles.textarea}} 
                placeholder="Steps for patient application..." 
              />
            </div>
          </section>

          {/* Section: Assets */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Pricing & Assets</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><DollarSign size={12} /> MSRP (PHP)</label>
              <input 
                type="number" 
                name="price" 
                value={form?.price || 0} 
                onChange={handleChange} 
                style={styles.input} 
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Product Asset</label>
              <div style={styles.uploadArea}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="edit-product-upload" />
                <label htmlFor="edit-product-upload" style={styles.uploadLabel}>
                  <CloudUpload size={20} color="#6366f1" />
                  {preview ? "Replace Current Image" : "Upload Image"}
                </label>
              </div>
              {preview && (
                <div style={styles.previewContainer}>
                  <img src={preview} alt="SKU Preview" style={styles.preview} />
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
            form="edit-product-form"
            disabled={isSubmitting} 
            style={{ 
              ...styles.saveBtn,
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
            {isSubmitting ? "Saving..." : "Update Product"}
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
  previewContainer: { marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" },
  preview: { width: "100%", height: "160px", objectFit: "cover" },
  footer: { padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px", background: "#fff" },
  cancelBtn: { flex: 1, height: "48px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 700, cursor: "pointer" },
  saveBtn: { flex: 2, height: "48px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer" },
};