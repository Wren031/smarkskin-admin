import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { Products } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Products, "id">) => void;
}

export default function AddProductModal({ isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    product_name: "",
    brand: "",
    description: "",
    price: 0,
    image_url: "",
    status: "Available",
  });

  const [preview, setPreview] = useState<string>("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    setForm({
      ...form,
      image_url: imageUrl,
    });
  };

  const handleSubmit = () => {
    if (!form.product_name || !form.brand) return;

    onSave(form);

    setForm({
      product_name: "",
      brand: "",
      description: "",
      price: 0,
      image_url: "",
      status: "Available",
    });

    setPreview("");

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <FaPlus color="#2563eb" />
          <h2 style={styles.title}>Add New Product</h2>
        </div>

        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter product name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter brand"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Product description"
          />
        </div>

        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Price</label>
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
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Product Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={styles.preview}
            />
          )}
        </div>

        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={styles.saveBtn} onClick={handleSubmit}>
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
  },

  modal: {
    width: 480,
    background: "#ffffff",
    padding: 28,
    borderRadius: 14,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
  },

  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
  },

  textarea: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    minHeight: 80,
    resize: "none",
  },

  fileInput: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  preview: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 8,
    marginTop: 8,
  },

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },

  cancelBtn: {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
};