import { useState, useEffect, type CSSProperties } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export default function AddConditionModal({
  isOpen,
  onCancel,
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
    onCancel();
  };

  return (
    <div
      style={styles.overlay}
      onClick={onCancel}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>Add Condition</h3>
          <p style={styles.subtitle}>
            Create a new skin condition profile
          </p>
        </div>

        {/* INPUT */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Condition Name</label>
          <input
            style={styles.input}
            placeholder="e.g. Acne Vulgaris"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
          />
          <span style={styles.helperText}>
            {value.length}/50 characters
          </span>
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button style={styles.secondary} onClick={onCancel}>
            Cancel
          </button>

          <button
            style={{
              ...styles.primary,
              opacity: value.trim() ? 1 : 0.5,
              cursor: value.trim() ? "pointer" : "not-allowed",
            }}
            disabled={!value.trim()}
            onClick={handleSubmit}
          >
            Add Condition
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#111",
    margin: 0,
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#333",
  },

  input: {
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
  },

  helperText: {
    fontSize: "11px",
    color: "#999",
    textAlign: "right",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "6px",
  },

  primary: {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s",
  },

  secondary: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
    cursor: "pointer",
  },
};