import { useState, useEffect, useMemo } from "react";

import type { CSSProperties } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import TitleSize from "../../../styles/TitleSize";
import RecommendationTable from "../components/RecommendationCardList";
import UpdateRecommendation from "../components/UpdateRecommendation";
import ConfirmModal from "../../../components/ConfirmModal";
import type { Recommendation } from "../types/Recommendation";

import RecommendationDetailModal from "../components/ViewRecommendationDrawer"; 
import AddRecommendations from "../components/AddRecommendations";
import useRecommendations from "../hooks/useRecommendations";
import ViewRecommendationDrawer from "../components/ViewRecommendationDrawer";

export default function RecommendationPage() {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All Severities");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Drawer States

  const [viewData, setViewData] = useState<Recommendation | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [selectedRec, setSelectedRec] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


  const { data, handleDelete, handleEdit, handleUpdate, selected, handleAdd } = useRecommendations();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((rec) => {
      const matchesSearch = [rec.condition?.name, rec.severity, rec.treatment]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filterSeverity === "All Severities" || rec.severity === filterSeverity;
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filterSeverity]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSeverity]);

  const handleViewAction = (rec: Recommendation) => {
    setViewData(rec);
    setIsViewOpen(true);
  };

  const handleEditAction = (rec: Recommendation) => {
    handleEdit(rec); // Sets the "selected" state in your hook
    setShowUpdate(true); // Opens the Update drawer
  };

  return (
    <div style={styles.container}>
      <style>{`
        .filter-option:hover { background-color: #f8fafc !important; color: #0f172a !important; }
        .page-node { transition: all 0.2s ease; cursor: pointer; }
        .page-node:hover:not(.active) { background-color: #f1f5f9; }
        .active-page { box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }
      `}</style>

      {/* Header */}
      <div className="header-group" style={styles.headerContainer}>
        <TitleSize
          title="Clinical Protocol Engine"
          subtitle="Review and deploy pharmaceutical recommendations for the facial diagnostic AI."
        />
        <button style={styles.addButton} onClick={() => setShowAdd(true)}>
          <FaPlus size={12} /> Add New Recommendation
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div style={styles.controlsRow}>
        <div style={styles.searchWrapper}>
          <FaSearch style={{ color: "#94a3b8", fontSize: "14px" }} />
          <input
            type="text"
            placeholder="Search conditions or protocols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} style={styles.filterDropdownTrigger}>
            <span style={{ opacity: filterSeverity === "All Severities" ? 0.6 : 1 }}>{filterSeverity}</span>
            <FaChevronDown size={10} style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          {isFilterOpen && (
            <div style={styles.dropdownMenu}>
              {["All Severities", "Severe", "Moderate", "Mild"].map((option) => (
                <div key={option} className="filter-option" style={styles.dropdownItem} 
                  onClick={() => { setFilterSeverity(option); setIsFilterOpen(false); }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div style={styles.tableWrapper}>
        <RecommendationTable
          recommendation={paginatedData}
          loading={loading}
          onEdit={handleEditAction}
          onDelete={(id: number) => { setDeleteId(id); setShowDelete(true); }}
          onView={handleViewAction}
        />
        
        {!loading && totalPages > 1 && (
          <div style={styles.paginationRow}>
            <span style={styles.pageInfo}>
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of {filteredData.length} protocols
            </span>
            <div style={styles.paginationControls}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1 }}>
                <FaChevronLeft size={12} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <div key={i + 1} className={`page-node ${currentPage === i + 1 ? 'active active-page' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ ...styles.pageNode, backgroundColor: currentPage === i + 1 ? "#0f172a" : "transparent", color: currentPage === i + 1 ? "#fff" : "#64748b" }}>
                  {i + 1}
                </div>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.3 : 1 }}>
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- DRAWERS (SIDE SLIDERS) --- */}

      {/* 1. ADD DRAWER */}
      {showAdd && (
        <AddRecommendations 
          onAdd={(newRec) => { handleAdd(newRec); setShowAdd(false); }} 
          onCancel={() => setShowAdd(false)} 
        />
      )}

      {/* 2. VIEW DRAWER */}
      <RecommendationDetailModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        data={viewData} 
      />

      <ViewRecommendationDrawer 
      isOpen={isViewOpen} 
      onClose={() => setIsViewOpen(false)} 
      data={selectedRec} 
    />

      {showUpdate && (
        <UpdateRecommendation 
          selected={selected} 
          onClose={() => setShowUpdate(false)} 
          onUpdate={(updatedRec) => {
            handleUpdate(updatedRec);
            setShowUpdate(false);
          }} 
        />
      )}

      {showDelete && (
        <ConfirmModal
          isOpen={showDelete}
          title="Archive Protocol?"
          message="This will remove the recommendation from the AI's active diagnostic database."
          onConfirm={() => { if (deleteId) handleDelete(deleteId); setShowDelete(false); }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "40px", backgroundColor: "#ffffff", minHeight: "100vh" },
  headerContainer: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "48px" },
  addButton: { padding: "12px 24px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" },
  controlsRow: { display: "flex", gap: "16px", marginBottom: "32px", alignItems: "center" },
  searchWrapper: { display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", backgroundColor: "#f8fafc", borderRadius: "14px", flex: 1, maxWidth: "450px", height: "48px", border: "1px solid #f1f5f9" },
  searchInput: { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#0f172a", fontWeight: 500 },
  filterDropdownTrigger: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "0 18px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", height: "48px", minWidth: "180px", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "#0f172a" },
  dropdownMenu: { position: "absolute", top: "56px", right: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 15px 35px -5px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden", padding: "6px" },
  dropdownItem: { padding: "12px 14px", fontSize: "13.5px", fontWeight: 600, color: "#64748b", cursor: "pointer", borderRadius: "10px" },
  tableWrapper: { borderRadius: "24px", border: "1px solid #f1f5f9", overflow: "hidden" },
  paginationRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", backgroundColor: "#fff", borderTop: "1px solid #f1f5f9" },
  pageInfo: { fontSize: "13px", color: "#94a3b8", fontWeight: 500 },
  paginationControls: { display: "flex", alignItems: "center", gap: "10px" },
  pageBtn: { background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", color: "#64748b", display: "flex", alignItems: "center", padding: "8px" },
  pageNode: { width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontSize: "13.5px", fontWeight: 700 }
};