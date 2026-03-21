import type { CSSProperties } from "react";

type Props = {
  id: number;
  onClose: () => void;
  onDelete: (id: number) => void;
};

export default function DeleteRecommendation({
  id,
  onClose,
  onDelete,
}: Props) {
  const handleDelete = () => {
    onDelete(id);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Delete Recommendation</h3>
        <p>Are you sure you want to delete this?</p>

        <div style={styles.actions}>
          <button onClick={handleDelete} style={{ background: "red", color: "#fff" }}>
            Delete
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10,
  },
};