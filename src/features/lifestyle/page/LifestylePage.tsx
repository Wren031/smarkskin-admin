import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Sparkles, Search, Activity } from "lucide-react";
import { useLifestyle } from "../hooks/useLifestyle";
import LifestyleCard from "../components/LifestyleCard";
import AddLifestyleDrawer from "../components/AddLifestyleDrawer";
import type { LifestyleTip } from "../types/Lifestyle";

export default function LifestylePage() {
  // --- 1. Hooks & Data Fetching ---
  const { tips = [], fetchTips, handleDelete, loading: hookLoading } = useLifestyle();
  
  // --- 2. State Hooks ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<LifestyleTip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullyReady, setIsFullyReady] = useState(false);

  // --- 3. Side Effects ---
  useEffect(() => {
    if (!hookLoading) {
      const timer = setTimeout(() => setIsFullyReady(true), 400);
      return () => clearTimeout(timer);
    } else {
      setIsFullyReady(false);
    }
  }, [hookLoading]);

  // --- 4. Memoized Logic (Must be before conditional returns) ---
  const filteredTips = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tips.filter((tip) => {
      return !query || 
        tip.title?.toLowerCase().includes(query) || 
        tip.description?.toLowerCase().includes(query);
    });
  }, [tips, searchQuery]);

  // --- 5. Handlers ---
  const handleOpenDrawer = useCallback((tip?: LifestyleTip) => {
    setSelectedTip(tip || null);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTip(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  // --- 6. Content Conditional Rendering ---
  // If loading, we return the container but with the loader INSIDE it.
  // This ensures the sidebar (which wraps this component) stays visible.
  if (!isFullyReady) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderArea}>
          <Activity className="animate-spin" size={42} color="#0f172a" />
          <p style={styles.loadingText}>Synchronizing Wellness Library...</p>
        </div>
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // --- 7. Main Page Content (Shown after loading) ---
  return (
    <div style={styles.container}>
      {/* Decorative background mesh */}
      <div style={styles.meshGradient} aria-hidden="true" />

      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Daily Routine & Lifestyle Tips</h1>
          <p style={styles.subtitle}>Curate and manage wellness content for the mobile ecosystem.</p>
        </div>
        
        <button 
          onClick={() => handleOpenDrawer()} 
          style={styles.addBtn}
          className="interactive-btn"
        >
          <Plus size={18} strokeWidth={2.5} /> 
          <span>New Entry</span>
        </button>
      </header>

      {/* Search Bar */}
      <section style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" style={styles.searchIcon} />
          <input 
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </section>

      {/* Grid Content */}
      <main style={styles.main}>
        {filteredTips.length > 0 ? (
          <div style={styles.grid}>
            {filteredTips.map(tip => (
              <LifestyleCard 
                key={tip.id} 
                tip={tip} 
                onDelete={handleDelete} 
                onEdit={() => handleOpenDrawer(tip)} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            isFiltered={searchQuery.length > 0} 
            onClear={clearFilters} 
          />
        )}
      </main>

      {/* Drawer */}
      <AddLifestyleDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        onSave={fetchTips} 
        editData={selectedTip} 
      />

      <style>{globalStyles}</style>
    </div>
  );
}

// --- Sub-Components ---
const EmptyState = ({ isFiltered, onClear }: { isFiltered: boolean, onClear: () => void }) => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIconWrapper}>
      <Sparkles size={32} color="#94a3b8" strokeWidth={1.5} />
    </div>
    <h3 style={styles.emptyTitle}>
      {isFiltered ? "No results found" : "No content yet"}
    </h3>
    <p style={styles.emptySubtitle}>
      {isFiltered 
        ? "Try adjusting your search query."
        : "Begin building your wellness database by publishing your first tip."}
    </p>
    {isFiltered && (
      <button onClick={onClear} style={styles.emptyBtn}>
        Clear Search
      </button>
    )}
  </div>
);

// --- CSS-in-JS ---
const globalStyles = `
  .interactive-btn:hover { 
    background: #1e293b !important; 
    transform: translateY(-1px); 
    box-shadow: 0 12px 20px -5px rgba(15, 23, 42, 0.15) !important; 
  }
  .interactive-btn:active { transform: translateY(0); }
`;

const styles: Record<string, React.CSSProperties> = {
  container: { 
    padding: "60px 40px", 
    margin: "0 auto", 
    minHeight: "100vh", 
    position: "relative", 
    backgroundColor: "#fff",
    fontFamily: "Inter, system-ui, sans-serif" 
  },
  loaderArea: {
    height: "calc(100vh - 120px)", // Adjusted to stay within page bounds
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { 
    marginTop: "16px", 
    color: "#64748b", 
    fontWeight: 500, 
    fontSize: "15px"
  },
  meshGradient: { 
    position: "absolute", 
    top: 0, left: 0, right: 0, 
    height: "400px", 
    background: "radial-gradient(circle at 2% 2%, rgba(241, 245, 249, 1) 0%, rgba(255, 255, 255, 0) 100%)", 
    zIndex: -1 
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end", 
    marginBottom: "48px" 
  },
  title: { 
    fontSize: "32px", fontWeight: 800, 
    color: "#0f172a", margin: 0, 
    letterSpacing: "-0.02em" 
  },
  subtitle: { color: "#64748b", marginTop: "4px", fontSize: "16px" },
  addBtn: { 
    background: "#0f172a", color: "#fff", border: "none", 
    padding: "12px 24px", borderRadius: "12px", 
    fontWeight: 600, fontSize: "14px", 
    display: "flex", alignItems: "center", gap: "8px", 
    cursor: "pointer", transition: "all 0.2s ease" 
  },
  filterBar: { 
    display: "flex", 
    marginBottom: "40px", 
    alignItems: "center" 
  },
  searchWrapper: { 
    position: "relative", 
    width: "100%",
    maxWidth: "500px" 
  },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" },
  searchInput: { 
    width: "100%", padding: "12px 12px 12px 42px", 
    borderRadius: "12px", border: "1px solid #e2e8f0", 
    fontSize: "14px", outline: "none", transition: "all 0.2s" 
  },
  main: { position: "relative" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
    gap: "24px" 
  },
  emptyState: { 
    textAlign: "center", padding: "80px 20px", 
    background: "#fcfcfd", borderRadius: "24px", 
    border: "1px dashed #e2e8f0" 
  },
  emptyIconWrapper: { 
    width: "64px", height: "64px", 
    background: "#fff", borderRadius: "20px", 
    display: "flex", alignItems: "center", justifyContent: "center", 
    margin: "0 auto 20px auto", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
  },
  emptyTitle: { fontSize: "18px", fontWeight: 700, color: "#0f172a" },
  emptySubtitle: { 
    color: "#64748b", maxWidth: "300px", 
    margin: "8px auto 24px auto", lineHeight: 1.5, fontSize: "14px" 
  },
  emptyBtn: { 
    background: "transparent", color: "#64748b", 
    border: "1px solid #e2e8f0", padding: "8px 16px", 
    borderRadius: "8px", fontWeight: 500, 
    fontSize: "13px", cursor: "pointer" 
  }
};