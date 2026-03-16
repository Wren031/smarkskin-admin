import React from "react";
import type { User } from "../typs/User";
import StatusBadge from "./StatusBadge";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflowX: "auto", // important for mobile scroll
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 700, // prevents columns from shrinking too much
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 18px",
    fontSize: 14,
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    whiteSpace: "nowrap",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e2e8f0",
  },

  row: {
    transition: "background 0.2s",
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
};

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} style={styles.empty}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                style={styles.row}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={styles.td}>
                  <img
                    src={user.image}
                    alt={user.fullname}
                    style={styles.avatar}
                  />
                </td>

                <td style={{ ...styles.td, fontWeight: 500 }}>
                  {user.fullname}
                </td>

                <td style={styles.td}>{user.address}</td>
                <td style={styles.td}>{user.gender}</td>
                <td style={styles.td}>{user.age}</td>
                <td style={styles.td}>{user.contact}</td>

                <td style={styles.td}>
                  <StatusBadge status={user.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}