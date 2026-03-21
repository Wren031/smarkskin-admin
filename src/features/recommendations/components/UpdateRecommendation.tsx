import { useState, useEffect, type CSSProperties } from "react";

type Props = {
  data: any;
  onClose: () => void;
  onUpdate: (updated: any) => void;
};

export default function UpdateRecommendation({
  data,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] = useState({
    condition: "",
    severity: "",
    treatment: "",
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isValid =
    form.condition.trim() !== "" &&
    form.severity.trim() !== "" &&
    form.treatment.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onUpdate({ ...form, id: data.id });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>Update Recommendation</h3>
          <p style={styles.subtitle}>
            Modify the recommendation details
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* CONDITION */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Condition</label>
            <input
              value={form.condition}
              onChange={(e) =>
                setForm({ ...form, condition: e.target.value })
              }
              placeholder="Condition"
              style={styles.input}
            />
          </div>

          {/* SEVERITY */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Severity</label>
            <input
              value={form.severity}
              onChange={(e) =>
                setForm({ ...form, severity: e.target.value })
              }
              placeholder="Severity"
              style={styles.input}
            />
          </div>

          {/* TREATMENT */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Treatment</label>
            <textarea
              value={form.treatment}
              onChange={(e) =>
                setForm({ ...form, treatment: e.target.value })
              }
              placeholder="Treatment details..."
              style={styles.textarea}
            />
          </div>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid}
              style={{
                ...styles.primaryButton,
                opacity: isValid ? 1 : 0.5,
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    width: 420,
    background: "#fff",
    borderRadius: 18,
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    margin: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#333",
  },

  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },

  textarea: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    minHeight: 90,
    resize: "vertical",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  primaryButton: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
  },

  secondaryButton: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    color: "#333",
    fontSize: 14,
    fontWeight: 500,
  },
};