import { useEffect, useState } from "react";
import type { Products } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
//   onSave: (product: Omit<Products, "id"> | Products) => void;
  product?: Products | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
}: Props) {
  const [form, setForm] = useState<Omit<Products, "id">>({
    product_name: "",
    brand: "",
    description: "",
    price: 0,
    image_url: "",
    status: "Available",
  });

  // If editing, load product data
  useEffect(() => {
    if (product) {
      setForm({
        product_name: product.product_name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        status: product.status,
      });
    } else {
      setForm({
        product_name: "",
        brand: "",
        description: "",
        price: 0,
        image_url: "",
        status: "Available",
      });
    }
  }, [product]);

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

//   const handleSubmit = () => {
//     if (product) {
//       onSave({ ...product, ...form }); // EDIT
//     } else {
//       onSave(form); // ADD
//     }

//     onClose();
//   };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{product ? "Edit Product" : "Add Product"}</h2>

        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <div style={styles.buttons}>
          {/* <button style={styles.saveBtn} onClick={handleSubmit}>
            {product ? "Update Product" : "Add Product"}
          </button> */}

          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
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
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    width: 400,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  },

  textarea: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
    minHeight: 60,
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
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
};