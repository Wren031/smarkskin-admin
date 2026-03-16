import type { UserStatus } from "../typs/UserStatus";
export default function StatusBadge({ status }: { status: UserStatus }) {
  const isActive = status === "Active";

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
        background: isActive
          ? "rgba(22, 163, 74, 0.12)"
          : "rgba(0, 0, 0, 0.15)",
        color: isActive ? "#16a34a" : "#e21300",
      }}
    >
      {status}
    </span>
  );
}