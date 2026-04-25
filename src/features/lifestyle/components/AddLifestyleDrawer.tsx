import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X, Lightbulb, Type, AlignLeft, Tag, Save, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { lifestyleServices } from "../services/lifestyleServices";
import type { LifestyleTip } from "../types/Lifestyle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editData?: LifestyleTip | null;
}

export default function AddLifestyleDrawer({ isOpen, onClose, onSave, editData }: Props) {
  // --- UI States ---
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [form, setForm] = useState({ 
    category: "", 
    title: "", 
    description: "" 
  });

  // Handle entry animation and form reset
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          category: editData.category,
          title: editData.title,
          description: editData.description
        });
      } else {
        setForm({ category: "", title: "", description: "" });
      }
      // Trigger slide-in after mount
      const frame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
    }
  }, [editData, isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for exit animation
  }, [onClose]);

  const isFormValid = useMemo(() => (
    form.title.trim() && form.category && form.description.trim()
  ), [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return toast.error("Please provide all required clinical details.");
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(editData ? "Updating repository..." : "Publishing tip...");

    try {
      if (editData) {
        await lifestyleServices.updateTip(editData.id, form);
        toast.success("Tip updated successfully", { id: loadingToast });
      } else {
        await lifestyleServices.addTip(form);
        toast.success("New wellness tip published", { id: loadingToast });
      }
      
      await onSave();
      handleClose();
    } catch (err) {
      toast.error("Database sync failed. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} 
      onClick={handleClose}
    >
      <div 
        style={{ 
          ...styles.drawer, 
          transform: isAnimating ? "translateX(0)" : "translateX(100%)" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Sparkles size={18} color="#0f172a" />
            </div>
            <div>
              <h2 style={styles.title}>{editData ? "Edit Lifestyle Tip" : "New Lifestyle Protocol"}</h2>
              <p style={styles.subtitle}>
                {editData ? `REFERENCE ID: ${editData.id}` : "WELLNESS CONTENT MANAGEMENT"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Close">
            <X size={14} />
          </button>
        </header>

        {/* BODY */}
        <form id="lifestyle-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* Metadata Section */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Classification</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Tag size={12} /> Category</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                  style={{ ...styles.input, ...styles.select }}
                >
                  <option value="">Select a category...</option>
                  <optgroup label="Physical Wellness">
                    <option value="diet">Diet & Nutrition</option>
                    <option value="hydration">Hydration</option>
                    <option value="exercise">Exercise</option>
                  </optgroup>
                  <optgroup label="Skin & Protection">
                    <option value="skincare_habits">Skincare Habits</option>
                    <option value="sun_protection">Sun Protection</option>
                    <option value="hygiene">Hygiene</option>
                  </optgroup>
                  <optgroup label="Lifestyle & Mind">
                    <option value="sleep">Sleep Hygiene</option>
                    <option value="lifestyle_habits">Lifestyle Habits</option>
                    <option value="stress_management">Stress Management</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Content & Guidance</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Type size={12} /> Subject Title</label>
              <input 
                placeholder="e.g., The Impact of Sleep on Skin Regeneration"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><AlignLeft size={12} /> Detailed Advice</label>
              <textarea 
                placeholder="Write the clinical or wellness advice here..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                style={{ ...styles.input, ...styles.textarea }}
              />
            </div>
          </section>
        </form>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <button onClick={handleClose} style={styles.cancelBtn}>Discard</button>
          <button 
            type="submit"
            form="lifestyle-form"
            disabled={!isFormValid || isSubmitting}
            style={{ 
              ...styles.saveBtn,
              backgroundColor: isFormValid ? "#0f172a" : "#f1f5f9",
              color: isFormValid ? "#fff" : "#94a3b8"
            }}
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSubmitting ? "Processing..." : (editData ? "Save Changes" : "Publish Protocol")}
          </button>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end",
    transition: "opacity 0.3s ease-out",
  },
  drawer: {
    width: "min(500px, 100vw)" as any,
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 50px rgba(0,0,0,0.1)",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: {
    padding: "24px 32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  badge: { 
    width: 42, height: 42, borderRadius: 12, background: "#f8fafc", 
    border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" 
  },
  title: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  subtitle: { fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px", marginTop: 4 },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b", display: "flex" },
  body: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 28 },
  section: { display: "flex", flexDirection: "column", gap: 20 },
  secHead: { display: "flex", alignItems: "center", gap: 12 },
  secLabel: { fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  secLine: { flex: 1, height: "1px", background: "#f1f5f9" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 6 },
  input: { 
    width: "100%", padding: "12px", fontSize: 14, border: "1px solid #e2e8f0", 
    borderRadius: 12, outline: "none", transition: "all 0.2s", background: "#fcfcfd" 
  },
  select: { appearance: "none", cursor: "pointer" },
  textarea: { height: "220px", resize: "none", lineHeight: "1.6" },
  footer: { 
    padding: "24px 32px", borderTop: "1px solid #f1f5f9", 
    display: "flex", gap: "16px", background: "#f8fafc" 
  },
  cancelBtn: { 
    flex: 1, height: "48px", borderRadius: 12, border: "1px solid #e2e8f0", 
    background: "#fff", color: "#64748b", fontWeight: 700, cursor: "pointer" 
  },
  saveBtn: { 
    flex: 2, height: "48px", borderRadius: 12, border: "none", fontWeight: 700, 
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", 
    cursor: "pointer", transition: "0.2s" 
  },
};