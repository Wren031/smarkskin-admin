import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import type { SkinCondition } from "../type/SkinCondition";
import { Activity, MoreVertical, Edit2, Trash2, Calendar } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

type Props = {
  condition: SkinCondition;
  onUpdate?: (id: number, updatedName: string) => void;
  onDelete?: (id: number) => void;
};
export default function ConditionCard({ condition, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [name, setName] = useState(condition.name);
  

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <Activity size={12} style={{ marginRight: 4 }} />
            Condition
          </div>

          <div style={styles.menuWrapper} ref={menuRef}>
            <button 
              style={open ? {...styles.menuButton, background: '#f4f4f5'} : styles.menuButton} 
              onClick={() => setOpen(!open)}
            >
              <MoreVertical size={16} color="#64748b" />
            </button>

            {open && (
              <div style={styles.dropdown}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => { setOpen(false); setShowUpdate(true); }}
                >
                  <Edit2 size={14} style={{ marginRight: 8 }} />
                  Edit Details
                </button>
                <div style={styles.divider} />
                <button
                  style={{ ...styles.dropdownItem, ...styles.deleteText }}
                  onClick={() => { setOpen(false); setShowDelete(true); }}
                >
                  <Trash2 size={14} style={{ marginRight: 8 }} />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.content}>
          <h3 style={styles.title}>{condition.name}</h3>
        </div>

        <div style={styles.footer}>
          <div style={styles.dateGroup}>
            <Calendar size={12} color="#94a3b8" style={{ marginRight: 4 }} />
            <span style={styles.dateLabel}>Added on</span>
            <span style={styles.dateValue}>
              {new Date(condition.created_at).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Modernized Update Modal */}
      {showUpdate && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={styles.modalTitle}>Update Condition</h3>
              <p style={styles.modalSubtitle}>Change the display name for this skin profile.</p>
            </div>
            
            <input
              style={styles.input}
              value={name}
              placeholder="e.g. Chronic Eczema"
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowUpdate(false)}>
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  onUpdate?.(condition.id, name);
                  setShowUpdate(false);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    <ConfirmModal
    isOpen={showDelete}
    title="Delete Condition"
    message={`Are you sure you want to delete "${condition.name}"? This action cannot be undone.`}
    confirmText="Delete"
    cancelText="Cancel"
    onCancel={() => setShowDelete(false)}
    onConfirm={() => {
        onDelete?.(condition.id);
        setShowDelete(false);
    }}
    />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    position: "relative",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "2px 8px",
    borderRadius: "6px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  content: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },

  title: { 
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.01em"
  },

  menuWrapper: { position: "relative" },

  menuButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    transition: "background 0.2s",
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    width: "160px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
    padding: "4px",
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    width: "100%",
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "13px",
    borderRadius: "4px",
    color: "#475569",
    transition: "background 0.1s",
  },

  divider: { height: "1px", background: "#f1f5f9", margin: "4px 0" },
  deleteText: { color: "#e11d48" },

  footer: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #f8fafc",
  },

  dateGroup: { display: "flex", alignItems: "center" },
  dateLabel: { fontSize: "12px", color: "#94a3b8", marginRight: "4px" },
  dateValue: { fontSize: "12px", color: "#64748b", fontWeight: 500 },

  /* Modal Styles */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },

  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  modalTitle: { margin: "0 0 4px 0", fontSize: "18px", fontWeight: 600, color: "#0f172a" },
  modalSubtitle: { margin: 0, fontSize: "14px", color: "#64748b", marginBottom: "20px" },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    marginBottom: "20px",
  },

  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  
  secondaryBtn: {
    background: "#fff",
    color: "#475569",
    border: "1px solid #e2e8f0",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
};