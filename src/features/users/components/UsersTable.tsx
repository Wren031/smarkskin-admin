import React from "react";
import type { User } from "../typs/User";
import StatusBadge from "./StatusBadge";
import { FaEye } from "react-icons/fa";

interface Props {
  users: User[];
  onView?: (user: User) => void;
}

export default function UsersTableView({ users, onView }: Props) {
  if (users.length === 0) {
    return <div style={styles.empty}>No users found</div>;
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Birth Date</th>
            <th style={styles.th}>Status</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={styles.tr}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* USER */}
              <td style={styles.td}>
                <div style={styles.userCell}>
                  <img
                    src={user.avatar_url}
                    alt={user.first_name}
                    style={styles.avatar}
                  />
                  <div>
                    <div style={styles.name}>
                      {user.first_name} {user.middle_name} {user.last_name}
                    </div>
                    <div style={styles.subText}>ID: {user.id}</div>
                  </div>
                </div>
              </td>

              <td style={styles.td}>{user.gender}</td>
              <td style={styles.td}>{user.address}</td>
              <td style={styles.td}>{user.date_of_birth}</td>

              <td style={styles.td}>
                <StatusBadge status={user.status} />
              </td>

              {/* ACTIONS (ALWAYS VISIBLE) */}
              <td style={{ ...styles.td, textAlign: "right" }}>
                <div style={styles.actions}>
                  <button
                    style={styles.iconBtn}
                    onClick={() => onView?.(user)}
                    title="View"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    background: "#ffffff",
    borderRadius: 10,
    marginTop: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    fontSize: 12,
    fontWeight: 600,
    color: "#7b7c7c",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  td: {
    padding: "14px 18px",
    fontSize: 14,
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    objectFit: "cover",
  },

  name: {
    fontWeight: 600,
    fontSize: 14,
  },

  subText: {
    fontSize: 12,
    color: "#94a3b8",
  },

  actions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },

  iconBtn: {
    width: "80px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    background: "#000000",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
};