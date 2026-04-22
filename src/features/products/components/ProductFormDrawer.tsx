import { useState, useEffect } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";
import toast from "react-hot-toast";
import { productServices } from "../services/productServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Products | null; // Receives the product to edit
  onUpdate: (product: Products) => Promise<void>;
}

export default function EditProductDrawer({ isOpen, onClose, product, onUpdate }: Props) {
  const [form, setForm] = useState<Products | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Sync form state when a product is selected for editing
  useEffect(() => {
    if (product) {
      setForm(product);
      setPreview(product.image_url || "");
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }) : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async () => {
    if (!form.product_name.trim()) { toast.error("Product name is required"); return; }
    
    const loadingToast = toast.loading("Updating product...");

    try {
      let finalImageUrl = form.image_url;
      
      // Only upload if a new file was selected
      if (file) {
        const uploaded = await productServices.uploadImage(file);
        if (uploaded) finalImageUrl = uploaded;
      }

      await onUpdate({ ...form, image_url: finalImageUrl });

      toast.dismiss(loadingToast);
      toast.success("Product updated successfully ✨");
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update product");
    }
  };

  return (
    <>
      <div 
        style={{ ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }} 
        onClick={onClose} 
      />

      <div style={{ ...styles.drawer, transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
        
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={styles.iconBox}><FaEdit size={14}/></div>
            <div>
              <h2 style={styles.title}>Edit Product</h2>
              <p style={styles.subtitle}>Update the information for this item.</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><FaTimes /></button>
        </div>

        <div style={styles.content}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (PHP)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={styles.select}>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Image</label>
            <div style={styles.uploadArea}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} id="edit-file-upload" />
              <label htmlFor="edit-file-upload" style={styles.uploadLabel}>
                Change Product Image
              </label>
            </div>
            {preview && (
              <div style={styles.previewContainer}>
                <img src={preview} alt="Preview" style={styles.preview} />
              </div>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </>
  );
}

// Styles remain identical to your AddProductDrawer for consistency
const styles: { [key: string]: CSSProperties } = {
    overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(4px)", zIndex: 1000, transition: "opacity 0.3s ease" },
    drawer: { position: "fixed", top: 0, right: 0, bottom: 0, width: "450px", maxWidth: "100%", background: "#ffffff", boxShadow: "-10px 0 50px rgba(0,0,0,0.1)", zIndex: 1001, display: "flex", flexDirection: "column", transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" },
    header: { padding: "24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    iconBox: { padding: "10px", background: "#f8fafc", borderRadius: "10px", color: "#0f172a", border: "1px solid #e2e8f0" },
    title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" },
    subtitle: { margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" },
    closeBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" },
    content: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "13px", fontWeight: 600, color: "#475569" },
    input: { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" },
    select: { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", background: "#fff" },
    textarea: { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", minHeight: "100px", fontSize: "14px", resize: "vertical", outline: "none" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    uploadArea: { border: "2px dashed #e2e8f0", borderRadius: "12px", padding: "20px", textAlign: "center" },
    fileInput: { display: "none" },
    uploadLabel: { fontSize: "14px", fontWeight: 600, color: "#6366f1", cursor: "pointer" },
    previewContainer: { marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid #f1f5f9" },
    preview: { width: "100%", height: "180px", objectFit: "cover" },
    footer: { padding: "20px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "12px", background: "#fff" },
    saveBtn: { background: "#0f172a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },
    cancelBtn: { background: "#fff", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" },
};