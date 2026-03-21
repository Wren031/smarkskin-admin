import { FaTrash } from "react-icons/fa";
import type { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconWrapper}>
          {icon || <FaTrash size={22} color="#dc2626" />}
        </div>

        <h3 style={styles.title}>{title}</h3>

        <p style={styles.message}>{message}</p>

        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>

          <button style={styles.deleteBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(3px)",
    zIndex: 1000,
  },

  modal: {
    background: "#ffffff",
    padding: "28px 30px",
    borderRadius: 14,
    width: 360,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  iconWrapper: {
    width: 50,
    height: 50,
    margin: "0 auto 12px",
    background: "#fee2e2",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    margin: "8px 0",
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
  },

  message: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 1.5,
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },

  cancelBtn: {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },
};