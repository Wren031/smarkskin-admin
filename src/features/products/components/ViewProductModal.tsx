import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaSave } from "react-icons/fa";
import type { Products } from "../types/Products";

interface Props {
  product: Products | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (product: Products) => void;
}

export default function ViewProductModal({
  product,
  isOpen,
  onClose,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Products | null>(product);

  useEffect(() => {
    setForm(product);
    setIsEditing(false);
  }, [product]);

  if (!isOpen || !product || !form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleSave = () => {
    onUpdate(form);
    setIsEditing(false);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <FaEye color="#2563eb" />
          <h2 style={styles.title}>
            {isEditing ? "Edit Product" : "Product Details"}
          </h2>
        </div>

        <img src={form.image_url} alt="product" style={styles.image} />

        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              name="product_name"
              value={form.product_name}
              disabled={!isEditing}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Brand</label>
            <input
              name="brand"
              value={form.brand}
              disabled={!isEditing}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            disabled={!isEditing}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            disabled={!isEditing}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.buttons}>
          {!isEditing && (
            <button
              style={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit
            </button>
          )}

          {isEditing && (
            <button style={styles.saveBtn} onClick={handleSave}>
              <FaSave /> Save
            </button>
          )}

          <button style={styles.closeBtn} onClick={onClose}>
            Close
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

  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
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

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  closeBtn: {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};