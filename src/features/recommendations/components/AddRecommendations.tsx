import { useState, type CSSProperties } from "react";
import type { Recommendation } from "../types/Recommendation";
import { SEVERITY } from "../types/Severity";

interface Props {
  onAdd: (rec: Recommendation) => void;
}

export default function AddRecommendations({ onAdd }: Props) {
  const [form, setForm] = useState<Partial<Recommendation>>({
    condition: "",
    severity: SEVERITY.MILD,
    treatment: "",
    precautions: "",
    products: [],
  });

  const handleChange = (field: keyof Recommendation, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecommendation: Recommendation = {
      id: Date.now(),
      condition: form.condition || "",
      severity: form.severity!,
      treatment: form.treatment || "",
      precautions: form.precautions || "",
      products: form.products || [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAdd(newRecommendation);

    // reset form
    setForm({
      condition: "",
      severity: SEVERITY.MILD,
      treatment: "",
      precautions: "",
      products: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Add Recommendation</h3>

      <input
        placeholder="Condition"
        value={form.condition}
        onChange={(e) => handleChange("condition", e.target.value)}
        style={styles.input}
      />

      <select
        value={form.severity}
        onChange={(e) => handleChange("severity", e.target.value)}
        style={styles.input}
      >
        {Object.values(SEVERITY).map((sev) => (
          <option key={sev} value={sev}>
            {sev}
          </option>
        ))}
      </select>

      <input
        placeholder="Treatment"
        value={form.treatment}
        onChange={(e) => handleChange("treatment", e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Precautions"
        value={form.precautions}
        onChange={(e) => handleChange("precautions", e.target.value)}
        style={styles.input}
      />

      <button type="submit" style={styles.button}>
        Add Recommendation
      </button>
    </form>
  );
}

const styles: Record<string, CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    width: 300,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 10,
    borderRadius: 6,
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};