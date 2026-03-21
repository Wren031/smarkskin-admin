import type { CSSProperties } from "react";
import type { IconType } from "react-icons";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: IconType;
};

export default function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div style={styles.card} role="region" aria-label={title}>
      <div style={styles.top}>
        <span style={styles.title}>{title}</span>
        <div style={styles.iconContainer} aria-hidden="true">
          <Icon size={25} color="#111827" />
        </div>
      </div>

      <h2 style={styles.value}>{value}</h2>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "15px",
    color: "#6b7280",
    fontWeight: 500,
    letterSpacing: "0.2px",
  },
  value: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#111827",
    marginTop: "10px",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafb",
    borderRadius: 10,
    width: 50,
    height: 50,
    border: "1px solid #f1f5f9",
  },
};