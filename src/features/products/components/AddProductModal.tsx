import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";
import toast from "react-hot-toast";
import { productServices } from "../services/productServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Products, "id">) => Promise<void>;
}

export default function AddProductModal({ isOpen, onClose, onSave }: Props) {
  

  const initialForm: Omit<Products, "id"> = {
    product_name: "",
    brand: "",
    description: "",
    price: 0,
    image_url: "",
    status: "Available",
  };

  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null); // ✅ FIX

  if (!isOpen) return null;

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // ✅ HANDLE IMAGE SELECT (preview only)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected); // ✅ store file
    setPreview(URL.createObjectURL(selected)); // preview only
  };

const handleSubmit = async () => {
  if (!form.product_name.trim()) {
    toast.error("Product name is required");
    return;
  }

  if (!form.brand.trim()) {
    toast.error("Brand is required");
    return;
  }

  if (!form.price || form.price <= 0) {
    toast.error("Price must be greater than 0");
    return;
  }

  const loadingToast = toast.loading("Saving product...");

  try {
    let imageUrl = ""; // ✅ start empty

    // ✅ Upload image FIRST
    if (file) {
      const uploaded = await productServices.uploadImage(file);

      if (!uploaded) {
        toast.dismiss(loadingToast);
        toast.error("Image upload failed");
        return;
      }

      imageUrl = uploaded; // ✅ store returned PUBLIC URL
    }

    // ❗ IMPORTANT: ensure image_url is always set
    const productToSave = {
      ...form,
      image_url: imageUrl, // ✅ guaranteed correct value
    };

    console.log("Saving product:", productToSave); // 🔍 DEBUG

    await onSave(productToSave);

    toast.dismiss(loadingToast);
    toast.success("Product added successfully 🎉");

    // reset
    setForm(initialForm);
    setPreview("");
    setFile(null);

    onClose();

  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error("Failed to add product");
    console.error(err);
  }
};
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>
          <FaPlus />
          <h2 style={styles.title}>Add New Product</h2>
        </div>

        {/* NAME + BRAND */}
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

        {/* DESCRIPTION */}
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

        {/* PRICE + STATUS */}
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Price</label>
            <input
              type="number"
              name="price"
              value={form.price || ""}
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
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        {/* IMAGE */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />

          {preview && (
            <img src={preview} alt="Preview" style={styles.preview} />
          )}
        </div>

        {/* BUTTONS */}
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

const styles: { [key: string]: CSSProperties } = {
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
  },

  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  textarea: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    minHeight: 80,
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
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
};