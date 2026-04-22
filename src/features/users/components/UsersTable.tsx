import { Eye, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge"; // Ensure this component exists
import type { CSSProperties } from "react";
import type { User } from "../types/User";


interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}


const Skeleton = ({ width, height, borderRadius = "8px" }: { width: string; height: string; borderRadius?: string }) => (
  <div className="skeleton-box" style={{ width, height, borderRadius }} />
);


export default function UsersTable({ 
  users, 
  onView, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalResults 
}: UsersTableProps) {
  
  return (
    <div style={styles.container}>
      {/* Dynamic Scoped Styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .table-row { transition: background 0.2s ease; border-bottom: 1px solid #f1f5f9; }
        .table-row:hover { background-color: #f8fafc; }
        
        .action-btn { 
          transition: all 0.2s ease; 
          border: 1px solid #e2e8f0; 
          background: white; 
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }
        .action-btn:hover { 
          background: #0f172a; 
          color: white; 
          border-color: #0f172a; 
        }

        .page-btn {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          transition: all 0.2s;
        }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { background: #f8fafc; border-color: #cbd5e1; }
      `}</style>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patient / User</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Birth Date</th>
            <th style={styles.th}>Status</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // --- LOADING STATE (SKELETONS) ---
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <Skeleton width="40px" height="40px" borderRadius="12px" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <Skeleton width="140px" height="12px" />
                      <Skeleton width="80px" height="10px" />
                    </div>
                  </div>
                </td>
                <td style={styles.td}><Skeleton width="60px" height="12px" /></td>
                <td style={styles.td}><Skeleton width="100px" height="12px" /></td>
                <td style={styles.td}><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                <td style={{ ...styles.td, textAlign: "right" }}><Skeleton width="80px" height="32px" /></td>
              </tr>
            ))
          ) : users.length === 0 ? (
            // --- EMPTY STATE ---
            <tr>
              <td colSpan={5} style={styles.empty}>
                <div style={styles.emptyContent}>
                  <UserCircle size={40} color="#cbd5e1" />
                  <p>No user records found matching your criteria.</p>
                </div>
              </td>
            </tr>
          ) : (
            // --- DATA STATE ---
            users.map((user) => (
              <tr key={user.id} className="table-row" style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" style={styles.avatar} />
                    ) : (
                      <div style={styles.avatarPlaceholder}>
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                    )}
                    <div>
                      <div style={styles.name}>{user.first_name} {user.last_name}</div>
                      <div style={styles.subText}>REF-{user.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.genderLabel}>{user.gender}</span>
                </td>
                <td style={styles.td}>{user.date_of_birth}</td>
                <td style={styles.td}>
                  <StatusBadge status={user.status} />
                </td>
                <td style={{ ...styles.td, textAlign: "right" }}>
                  <button 
                    className="action-btn" 
                    onClick={() => onView(user)}
                  >
                    <Eye size={14} /> Open Profile
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* --- PAGINATION CONTROLS --- */}
      {!loading && totalResults > 0 && (
        <div style={styles.paginationFooter}>
          <div style={styles.paginationInfo}>
            Showing <b>{users.length}</b> of <b>{totalResults}</b> users
          </div>
          
          <div style={styles.paginationControls}>
            <button 
              className="page-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            
            <div style={styles.pageIndicator}>
              Page <span>{currentPage}</span> of {totalPages}
            </div>

            <button 
              className="page-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---

const styles: Record<string, CSSProperties> = {
  container: { width: "100%", backgroundColor: "#fff", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
  th: { 
    textAlign: "left", 
    padding: "16px 20px", 
    fontSize: "11px", 
    fontWeight: 700,
    color: "#94a3b8", 
    textTransform: "uppercase", 
    letterSpacing: "0.05em",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fafafa"
  },
  td: { padding: "16px 20px", fontSize: "14px", color: "#475569" },
  tr: { verticalAlign: "middle" },
  userCell: { display: "flex", alignItems: "center", gap: "14px" },
  avatar: { width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover", backgroundColor: "#f8fafc" },
  avatarPlaceholder: {
    width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#eff6ff", color: "#3b82f6",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700
  },
  name: { fontWeight: 600, color: "#0f172a", fontSize: "14px" },
  subText: { fontSize: "11px", color: "#94a3b8", fontWeight: 500, marginTop: "2px" },
  genderLabel: { textTransform: "capitalize", fontWeight: 500 },
  empty: { padding: "80px 0" },
  emptyContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#94a3b8", fontSize: "14px" },
  
  // Pagination Specific Styles
  paginationFooter: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f1f5f9",
    backgroundColor: "#fff"
  },
  paginationInfo: { fontSize: "13px", color: "#64748b" },
  paginationControls: { display: "flex", alignItems: "center", gap: "16px" },
  pageIndicator: { fontSize: "13px", color: "#64748b", fontWeight: 500 },
};