import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import { MoreVertical, Edit3, Trash, Calendar } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

interface ConditionCardProps {
  condition: any;
  onUpdate: (id: any, name: string) => void;
  onDelete: (id: any) => void;
}

export default function ConditionCard({ condition, onUpdate, onDelete }: ConditionCardProps) {
  const [open, setOpen] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [name, setName] = useState(condition.name);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <style>{`
        .card-animate { transition: all 0.2s ease-in-out; border: 1px solid #e2e8f0; }
        .card-animate:hover { transform: translateY(-4px); border-color: #cbd5e1; box-shadow: 0 12px 20px -10px rgba(0,0,0,0.08); }
        .menu-item:hover { background-color: #f8fafc; }
      `}</style>

      <div className="card-animate" style={styles.card}>
        <div style={styles.header}>
          <span style={styles.idBadge}>ID-{String(condition.id).padStart(3, '0')}</span>
          <div style={styles.actionSection} ref={menuRef}>
            <button style={styles.iconBtn} onClick={() => setOpen(!open)}>
              <MoreVertical size={18} color="#94a3b8" />
            </button>
            {open && (
              <div style={styles.dropdown}>
                <button className="menu-item" style={styles.dropdownItem} onClick={() => { setOpen(false); setShowUpdate(true); }}>
                  <Edit3 size={14} /> <span>Edit Details</span>
                </button>
                <button className="menu-item" style={{ ...styles.dropdownItem, color: "#ef4444" }} onClick={() => { setOpen(false); setShowDelete(true); }}>
                  <Trash size={14} /> <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 style={styles.title}>{condition.name}</h3>

        <div style={styles.footer}>
          <div style={styles.meta}>
            <Calendar size={12} />
            <span>{formatDate(condition.created_at)}</span>
          </div>
        </div>
      </div>

      {showUpdate && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Update Condition</h2>
            <input 
              style={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              autoFocus 
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowUpdate(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={() => { onUpdate(condition.id, name); setShowUpdate(false); }}>Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Condition"
        message={`Remove "${condition.name}" from diagnostic logic?`}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => { onDelete(condition.id); setShowDelete(false); }}
      />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  card: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  idBadge: { fontSize: '10px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' },
  title: { fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 },
  footer: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '8px' },
  meta: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' },
  actionSection: { position: 'relative' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  dropdown: { position: 'absolute', top: '100%', right: 0, width: '140px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, padding: '4px' },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#475569', textAlign: 'left', borderRadius: '6px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', padding: '24px', borderRadius: '16px', width: '340px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalTitle: { fontSize: '18px', fontWeight: 700, marginBottom: '16px' },
  input: { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  cancelBtn: { padding: '8px 16px', border: 'none', background: '#f1f5f9', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 },
  saveBtn: { padding: '8px 16px', border: 'none', background: '#0f172a', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }
};