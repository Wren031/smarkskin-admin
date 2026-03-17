import { type CSSProperties, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recommendation as recommendationData } from "../data/recommendations";

interface Product {
  id: number;
  product_name: string;
  image_url: string;
}

interface Recommendation {
  id: number;
  condition: string;
  severity: "Mild" | "Moderate" | "Severe";
  treatment: string;
  precautions: string;
  products?: Product[];
  createdAt: string;
}

export default function ViewRecommendationsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const recommendation: Recommendation | undefined = useMemo(
    () => recommendationData.find((item) => item.id === Number(id)),
    [id]
  );

  if (!recommendation) {
    return <EmptyState onBack={() => navigate(-1)} />;
  }

  return (
    <div style={styles.page}>
      <Header onBack={() => navigate(-1)} />

      <div style={styles.card}>
        <Section title="General Information">
          <InfoRow label="ID" value={recommendation.id} />
          <InfoRow label="Condition" value={recommendation.condition} />
        </Section>

        <Section title="Assessment">
          <div style={styles.row}>
            <span style={styles.label}>Severity</span>
            <span
              style={{
                ...styles.badge,
                ...getSeverityStyle(recommendation.severity),
              }}
            >
              {recommendation.severity}
            </span>
          </div>
        </Section>

        <Section title="Care Plan">
          <InfoRow label="Treatment" value={recommendation.treatment} />
          <InfoRow
            label="Precautions"
            value={recommendation.precautions}
          />
        </Section>

        <Section title="Recommended Products">
          <ProductList products={recommendation.products} />
        </Section>

        <Footer createdAt={recommendation.createdAt} />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Recommendation Details</h1>
        <p style={styles.subtitle}>
          Complete overview of condition, treatment, and products
        </p>
      </div>
      <button onClick={onBack} style={styles.secondaryBtn}>
        ← Back
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

function ProductList({ products }: { products?: Product[] }) {
  if (!products?.length) {
    return <p style={styles.noData}>No products available</p>;
  }

  return (
    <div style={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} style={styles.productCard}>
          <img
            src={product.image_url}
            alt={product.product_name}
            style={styles.productImage}
          />
          <p style={styles.productName}>{product.product_name}</p>
        </div>
      ))}
    </div>
  );
}

function Footer({ createdAt }: { createdAt: string }) {
  return (
    <div style={styles.footer}>
      <span style={styles.footerLabel}>Created At</span>
      <span style={styles.footerValue}>{createdAt}</span>
    </div>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div style={styles.centerContainer}>
      <div style={styles.emptyCard}>
        <h2 style={styles.emptyTitle}>Recommendation Not Found</h2>
        <p style={styles.emptyText}>
          The requested record could not be located.
        </p>
        <button onClick={onBack} style={styles.primaryBtn}>
          ← Go Back
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function getSeverityStyle(severity: Recommendation["severity"]) {
  switch (severity) {
    case "Severe":
      return styles.severe;
    case "Moderate":
      return styles.moderate;
    default:
      return styles.mild;
  }
}

/* ================= STYLES ================= */

const styles: Record<string, CSSProperties> = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(to bottom, #f8fafc, #eef2f7)",
    minHeight: "100vh",
    padding: "50px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 900,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: 14,
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "#ffffff",
    borderRadius: 18,
    padding: 28,
    boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f2937",
    borderLeft: "4px solid #2563eb",
    paddingLeft: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  label: {
    fontWeight: 600,
    color: "#374151",
  },

  value: {
    color: "#111827",
    textAlign: "right",
    maxWidth: "60%",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 18,
  },

  productCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },

  productImage: {
    width: "100%",
    height: 110,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 8,
  },

  productName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
  },

  noData: {
    color: "#6b7280",
    fontSize: 14,
  },

  badge: {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
  },

  mild: {
    background: "#dcfce7",
    color: "#166534",
  },

  moderate: {
    background: "#fef9c3",
    color: "#854d0e",
  },

  severe: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #e5e7eb",
  },

  footerLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  footerValue: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
  },

  primaryBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "8px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },

  centerContainer: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f8fb",
  },

  emptyCard: {
    background: "#fff",
    padding: 40,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    textAlign: "center",
    maxWidth: 320,
  },

  emptyTitle: {
    marginBottom: 8,
  },

  emptyText: {
    color: "#6b7280",
    marginBottom: 20,
  },
};