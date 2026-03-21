import type { UserStatus } from "../typs/UserStatus";

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  Active: {
    bg: "#dcfce7",
    color: "#16a34a",
    label: "Active",
  },
  Inactive: {
    bg: "#fee2e2",
    color: "#dc2626",
    label: "Inactive",
  },
  Pending: {
    bg: "#fef9c3",
    color: "#ca8a04",
    label: "Pending",
  },
};

export default function StatusBadge({ status }: { status: UserStatus }) {
  const style = STATUS_STYLES[status] || {
    bg: "#e2e8f0",
    color: "#475569",
    label: status,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        minWidth: 70,
      }}
    >
      {style.label}
    </span>
  );
}