import React, { useMemo, useState } from "react";
import { FiFileText, FiLayers, FiAlertTriangle } from "react-icons/fi";
type Severity = "Mild" | "Moderate" | "Severe";

interface Recommendation {
  id: number;
  condition: string;
  severity: Severity;
  treatment: string;
  products: string;
  shopeeLink: string;
  lazadaLink: string;
  precautions: string;
}
const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    condition: "Acne",
    severity: "Moderate",
    treatment:
      "Cleanse gently twice daily. Use salicylic acid (0.5–2%) once daily; increase as tolerated.",
    products:
      "Gentle Cleanser, Salicylic Acid Serum, Oil-Free Moisturizer, SPF 30+",
    shopeeLink: "https://shopee.ph/example-acne-product",
    lazadaLink: "https://lazada.com.ph/example-acne-product",
    precautions:
      "Avoid picking. If irritation occurs, reduce frequency and consult a dermatologist.",
  },
  {
    id: 2,
    condition: "Dry Skin",
    severity: "Severe",
    treatment:
      "Apply a ceramide-rich moisturizer immediately after washing.",
    products:
      "Hydrating Cleanser, Ceramide Moisturizer, Occlusive Balm, SPF 30+",
    shopeeLink: "https://shopee.ph/example-dryskin-product",
    lazadaLink: "https://lazada.com.ph/example-dryskin-product",
    precautions:
      "Avoid hot showers and harsh exfoliants.",
  },
  {
    id: 3,
    condition: "Hyperpigmentation",
    severity: "Mild",
    treatment:
      "Daily sunscreen is essential. Consider niacinamide or vitamin C.",
    products: "Vitamin C Serum, Niacinamide, Broad Spectrum SPF 50",
    shopeeLink: "https://shopee.ph/example-pigment-product",
    lazadaLink: "https://lazada.com.ph/example-pigment-product",
    precautions:
      "Patch test new actives.",
  },
];

export default function RecommendationManagementPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    INITIAL_RECOMMENDATIONS
  );

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Recommendation | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return recommendations.filter((rec) => {
      const matchesSearch =
        keyword.length === 0 ||
        rec.condition.toLowerCase().includes(keyword) ||
        rec.treatment.toLowerCase().includes(keyword) ||
        rec.products.toLowerCase().includes(keyword) ||
        rec.precautions.toLowerCase().includes(keyword);

      const matchesSeverity =
        severityFilter === "All" || rec.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [recommendations, search, severityFilter]);

  const stats = useMemo(() => {
    const total = recommendations.length;
    const severe = recommendations.filter((r) => r.severity === "Severe").length;

    // unique conditions covered
    const conditions = new Set(recommendations.map((r) => r.condition.trim()));
    const covered = conditions.size;

    return { total, covered, severe };
  }, [recommendations]);

  const openAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (rec: Recommendation) => {
    setEditing(rec);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSave = (data: Omit<Recommendation, "id">) => {
    if (editing) {
      setRecommendations((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...editing, ...data } : item
        )
      );
    } else {
      setRecommendations((prev) => [
        { id: Date.now(), ...data },
        ...prev,
      ]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Delete this recommendation?");
    if (!ok) return;
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>AI Tretment Plan Management</h1>
          <p style={styles.subtitle}>
            Manage condition-based recommendations used by the facial health AI
          </p>
        </div>

        <button style={styles.primaryButton} onClick={openAdd}>
          + Add Recommendation
        </button>
      </div>

    <div style={styles.statsGrid}>
      <StatCard
        label="Total Recommendations"
        value={stats.total}
        icon={<FiFileText size={20} />}
      />
      <StatCard
        label="Conditions Covered"
        value={stats.covered}
        icon={<FiLayers size={20} />}
      />
      <StatCard
        label="High Severity Rules"
        value={stats.severe}
        icon={<FiAlertTriangle size={20} />}
      />
    </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrap}>
          <label style={styles.label}>Search</label>
          <input
            style={styles.input}
            placeholder="Search by condition, treatment, products, precautions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.selectWrap}>
          <label style={styles.label}>Severity</label>
          <select
            style={styles.input}
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value as Severity | "All")
            }
          >
            <option value="All">All</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <div style={styles.tableHeaderRow}>
          <div style={styles.tableTitle}>Recommendation Rules</div>
          <div style={styles.tableMeta}>
            Showing <b>{filtered.length}</b> of <b>{recommendations.length}</b>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Condition</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Treatment Plan</th>
                <th style={styles.th}>Suggested Products</th>
                <th style={styles.th}>Precautions</th>
                <th style={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td style={styles.emptyCell} colSpan={6}>
                    No recommendations found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id}>
                    <td style={styles.tdStrong}>{rec.condition}</td>
                    <td style={styles.td}>
                      <SeverityBadge severity={rec.severity} />
                    </td>
                    <td style={styles.td}>{rec.treatment}</td>
                    <td style={styles.td}>
                    <div>{rec.products}</div>

                    {rec.shopeeLink && (
                        <a
                        href={rec.shopeeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.linkButton}
                        >
                        Shopee
                        </a>
                    )}

                    {rec.lazadaLink && (
                        <a
                        href={rec.lazadaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...styles.linkButton, marginLeft: 8 }}
                        >
                        Lazada
                        </a>
                    )}
                    </td>
                    <td style={styles.td}>{rec.precautions}</td>
                    <td style={styles.tdRight}>
                      <button
                        style={styles.editButton}
                        onClick={() => openEdit(rec)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(rec.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.disclaimer}>
          <b>Note:</b> Recommendations should be reviewed by a qualified health
          professional. Include a medical disclaimer in user-facing views.
        </div>
      </div>

      {/* Modal */}
            {isModalOpen && (
            <RecommendationModal
                title={editing ? "Edit Recommendation" : "Add Recommendation"}
                initial={
                editing
                    ? {
                        condition: editing.condition,
                        severity: editing.severity,
                        treatment: editing.treatment,
                        products: editing.products,
                        shopeeLink: editing.shopeeLink,
                        lazadaLink: editing.lazadaLink,
                        precautions: editing.precautions,
                    }
                    : null
                }
                onClose={closeModal}
                onSave={handleSave}
            />
            )}
    </div>
  );
}

/* =========================
   Components
========================= */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTopRow}>
        <div style={styles.statIconWrap}>{icon}</div>
      </div>

      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}
function SeverityBadge({ severity }: { severity: Severity }) {
  const palette: Record<
    Severity,
    { fg: string; bg: string; border: string }
  > = {
    Mild: { fg: "#15803d", bg: "rgba(21,128,61,0.10)", border: "#bbf7d0" },
    Moderate: { fg: "#b45309", bg: "rgba(180,83,9,0.10)", border: "#fde68a" },
    Severe: { fg: "#b91c1c", bg: "rgba(185,28,28,0.10)", border: "#fecaca" },
  };

  const c = palette[severity];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.fg,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.2,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: c.fg,
        }}
      />
      {severity}
    </span>
  );
}

function RecommendationModal({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
initial: Omit<Recommendation, "id"> | null;
  onClose: () => void;
  onSave: (data: Omit<Recommendation, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Recommendation, "id">>(
initial || {
  condition: "",
  severity: "Mild",
  treatment: "",
  products: "",
  shopeeLink: "",
  lazadaLink: "",
  precautions: "",
}
  );

  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Omit<Recommendation, "id">, string>> = {};
    if (!form.condition.trim()) e.condition = "Condition is required.";
    if (!form.treatment.trim()) e.treatment = "Treatment plan is required.";
    if (!form.products.trim()) e.products = "Suggested products is required.";
    if (!form.precautions.trim()) e.precautions = "Precautions is required.";
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

const submit = () => {
  setTouched(true);
  if (hasErrors) return;

  onSave({
    condition: form.condition.trim(),
    severity: form.severity,
    treatment: form.treatment.trim(),
    products: form.products.trim(),
    shopeeLink: form.shopeeLink.trim(),
    lazadaLink: form.lazadaLink.trim(),
    precautions: form.precautions.trim(),
  });
};

  return (
    <div style={styles.modalOverlay} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalTitle}>{title}</div>
            <div style={styles.modalSub}>
              Set the rule used when the AI detects this condition + severity.
            </div>
          </div>

          <button style={styles.iconButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={styles.modalGrid}>
          <div style={styles.field}>
            <label style={styles.modalLabel}>Condition</label>
            <input
              style={styles.modalInput}
              placeholder="e.g., Acne, Dry Skin, Wrinkles"
              value={form.condition}
              onChange={(e) =>
                setForm((p) => ({ ...p, condition: e.target.value }))
              }
              onBlur={() => setTouched(true)}
            />
            {touched && errors.condition && (
              <div style={styles.errorText}>{errors.condition}</div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.modalLabel}>Severity</label>
            <select
              style={styles.modalInput}
              value={form.severity}
              onChange={(e) =>
                setForm((p) => ({ ...p, severity: e.target.value as Severity }))
              }
            >
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.modalLabel}>Treatment Plan</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="Provide a concise, evidence-based plan..."
              value={form.treatment}
              onChange={(e) =>
                setForm((p) => ({ ...p, treatment: e.target.value }))
              }
              onBlur={() => setTouched(true)}
            />
            {touched && errors.treatment && (
              <div style={styles.errorText}>{errors.treatment}</div>
            )}
          </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.modalLabel}>Suggested Products</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="List suggested products (generic categories or examples)..."
              value={form.products}
              onChange={(e) =>
                setForm((p) => ({ ...p, products: e.target.value }))
              }
              onBlur={() => setTouched(true)}
            />
            {touched && errors.products && (
              <div style={styles.errorText}>{errors.products}</div>
            )}
          </div>

                  <div style={styles.field}>
        <label style={styles.modalLabel}>Shopee Product Link</label>
        <input
            style={styles.modalInput}
            placeholder="https://shopee.ph/..."
            value={form.shopeeLink}
            onChange={(e) =>
            setForm((p) => ({ ...p, shopeeLink: e.target.value }))
            }
        />
        </div>

        <div style={styles.field}>
        <label style={styles.modalLabel}>Lazada Product Link</label>
        <input
            style={styles.modalInput}
            placeholder="https://lazada.com.ph/..."
            value={form.lazadaLink}
            onChange={(e) =>
            setForm((p) => ({ ...p, lazadaLink: e.target.value }))
            }
        />
        </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.modalLabel}>Precautions</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="Warnings, patch test advice, when to consult a professional..."
              value={form.precautions}
              onChange={(e) =>
                setForm((p) => ({ ...p, precautions: e.target.value }))
              }
              onBlur={() => setTouched(true)}
            />
            {touched && errors.precautions && (
              <div style={styles.errorText}>{errors.precautions}</div>
            )}
          </div>

          
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{
              ...styles.primaryButton,
              opacity: hasErrors ? 0.85 : 1,
            }}
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: 10,
    background: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#0f172a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    maxWidth: 680,
    lineHeight: 1.45,
  },

  primaryButton: {
    padding: "10px 16px",
    borderRadius: 10,
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #1d4ed8",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(37,99,235,0.18)",
    whiteSpace: "nowrap",
  },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: 10,
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    fontWeight: 700,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 18,
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #eef2f7",
    boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
    padding: 18,
  },


  filterBar: {
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: 14,
    alignItems: "end",
    marginBottom: 16,
  },
  searchWrap: { display: "flex", flexDirection: "column", gap: 6 },
  selectWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 800, color: "#334155" },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    outline: "none",
    background: "#ffffff",
    fontSize: 14,
  },

  card: {
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid #eef2f7",
    boxShadow: "0 16px 36px rgba(15,23,42,0.06)",
    overflow: "hidden",
  },
  tableHeaderRow: {
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    borderBottom: "1px solid #eef2f7",
  },
  tableTitle: { fontSize: 14, fontWeight: 900, letterSpacing: 0.2 },
  tableMeta: { fontSize: 13, color: "#64748b" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 900,
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #eef2f7",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  thRight: {
    textAlign: "right",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 900,
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #eef2f7",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  linkButton: {
  display: "inline-block",
  marginTop: 8,
  padding: "6px 10px",
  borderRadius: 8,
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  fontSize: 12,
  fontWeight: 700,
  color: "#2563eb",
  textDecoration: "none",
},
  td: {
    padding: "14px 16px",
    fontSize: 13,
    borderBottom: "1px solid #eef2f7",
    color: "#0f172a",
    verticalAlign: "top",
    lineHeight: 1.45,
    minWidth: 180,
  },
  tdStrong: {
    padding: "14px 16px",
    fontSize: 13,
    borderBottom: "1px solid #eef2f7",
    fontWeight: 900,
    color: "#0f172a",
    verticalAlign: "top",
    whiteSpace: "nowrap",
    minWidth: 140,
  },
  tdRight: {
    padding: "14px 16px",
    fontSize: 13,
    borderBottom: "1px solid #eef2f7",
    textAlign: "right",
    verticalAlign: "top",
    whiteSpace: "nowrap",
    minWidth: 160,
  },
  emptyCell: {
    padding: 18,
    textAlign: "center",
    color: "#64748b",
  },

  editButton: {
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid #fde68a",
    background: "rgba(245,158,11,0.14)",
    color: "#92400e",
    fontWeight: 900,
    cursor: "pointer",
    marginRight: 8,
  },
  deleteButton: {
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid #fecaca",
    background: "rgba(239,68,68,0.12)",
    color: "#b91c1c",
    fontWeight: 900,
    cursor: "pointer",
  },

  disclaimer: {
    padding: "14px 18px",
    fontSize: 12,
    color: "#64748b",
    background: "#fbfdff",
    borderTop: "1px solid #eef2f7",
    lineHeight: 1.5,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 10,
},
statTopRow: {
  display: "flex",
  justifyContent: "flex-end",
},

statIconWrap: {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: "rgba(37,99,235,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000000",
},

statValue: {
  fontSize: 28,
  fontWeight: 900,
  marginTop: 10,
  letterSpacing: -0.5,
},

statLabel: {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 600,
  marginTop: 4,
},

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    zIndex: 50,
  },
  modal: {
    width: "min(760px, 100%)",
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    boxShadow: "0 30px 80px rgba(0,0,0,0.30)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    borderBottom: "1px solid #eef2f7",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 1000 as any,
    letterSpacing: 0.1,
  },
  modalSub: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.35,
  },
  iconButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 10,
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 900,
  },

  modalGrid: {
    padding: 18,
    display: "grid",
    gridTemplateColumns: "1fr 200px",
    gap: 12,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  modalLabel: { fontSize: 12, fontWeight: 900, color: "#334155" },
  modalInput: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: 14,
  },
  modalTextarea: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: 14,
    minHeight: 86,
    resize: "vertical",
    lineHeight: 1.4,
  },
  errorText: { fontSize: 12, color: "#b91c1c", fontWeight: 700 },

  modalFooter: {
    padding: 18,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    borderTop: "1px solid #eef2f7",
    background: "#fbfdff",
  },
  
};