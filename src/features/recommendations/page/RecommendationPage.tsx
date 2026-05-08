import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
// Added Activity to lucide-react imports
import { FaPlus, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Activity } from "lucide-react"; 

import TitleSize from "../../../styles/TitleSize";
import RecommendationTable from "../components/RecommendationCardList";
import UpdateRecommendation from "../components/UpdateRecommendation";
import ConfirmModal from "../../../components/ConfirmModal";
import type { Recommendation } from "../types/Recommendation";

import AddRecommendations from "../components/AddRecommendations";
import useRecommendations from "../hooks/useRecommendations";
import ViewRecommendationDrawer from "../components/ViewRecommendationDrawer";

export default function RecommendationPage() {
  // 1. HOOKS SECTION (Must always run in the same order)
  const { data = [], handleDelete, handleEdit, handleUpdate, selected, handleAdd } = useRecommendations();

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All Severities");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewData, setViewData] = useState<Recommendation | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSeverity]);

  // 2. HANDLERS
  const handleViewAction = (rec: Recommendation) => {
    setViewData(rec);
    setIsViewOpen(true);
  };

  const handleEditAction = (rec: Recommendation) => {
    handleEdit(rec);
    setShowUpdate(true);
  };

  // 3. EARLY RETURN (Placed AFTER all Hooks)
  if (loading) return (
    <div style={styles.center}>
        <Activity className="animate-spin" color="#0f172a" />
        <style>{`
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        .filter-option:hover { background-color: #f8fafc !important; color: #0f172a !important; }
        .page-node { transition: all 0.2s ease; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .page-node:hover:not(.active) { background-color: #f1f5f9; }
        .active-page { box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }

        .responsive-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 48px; gap: 20px; }
        .responsive-controls { display: flex; gap: 16px; margin-bottom: 32px; align-items: center; }
        .responsive-pagination { display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background-color: #fff; border-top: 1px solid #f1f5f9; }

        @media (max-width: 768px) {
          .responsive-header { flex-direction: column; margin-bottom: 32px; }
          .add-button { width: 100%; justify-content: center; }
          .responsive-controls { flex-direction: column; align-items: stretch; }
          .search-wrapper { max-width: none !important; }
          .filter-container { width: 100%; }
          .dropdown-trigger { width: 100% !important; }
          .responsive-pagination { flex-direction: column; gap: 20px; text-align: center; padding: 24px 16px; }
        }
      `}</style>

      {/* Header */}
      <div className="responsive-header">
        <TitleSize
          title="Manage Recommendations"
          subtitle="Review and deploy pharmaceutical recommendations for the facial diagnostic AI."
        />
        <button className="add-button" style={styles.addButton} onClick={() => setShowAdd(true)}>
          <FaPlus size={12} /> Add New Recommendation
        </button>
      </div>

      {/* Search & Filter */}
      <div className="responsive-controls">
        <div className="search-wrapper" style={styles.searchWrapper}>
          <FaSearch style={{ color: "#94a3b8", fontSize: "14px" }} />
          <input
            type="text"
            placeholder="Search conditions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="filter-container" style={{ position: 'relative' }}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="dropdown-trigger" style={styles.filterDropdownTrigger}>
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

      {/* Table Section */}
      <div style={styles.tableWrapper}>
        <div style={{ overflowX: 'auto' }}>
            <RecommendationTable
              recommendation={paginatedData}
              loading={loading}
              onEdit={handleEditAction}
              onDelete={(id: number) => { setDeleteId(id); setShowDelete(true); }}
              onView={handleViewAction}
            />
        </div>
        
        {totalPages > 1 && (
          <div className="responsive-pagination">
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
                  style={{ 
                    ...styles.pageNode, 
                    backgroundColor: currentPage === i + 1 ? "#0f172a" : "transparent", 
                    color: currentPage === i + 1 ? "#fff" : "#64748b",
                    width: "36px", height: "36px", borderRadius: "10px", fontSize: "13.5px", fontWeight: 700 
                  }}>
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

      {/* Modals */}
      {showAdd && <AddRecommendations onAdd={(newRec) => { handleAdd(newRec); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}
      <ViewRecommendationDrawer isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} data={viewData} />
      {showUpdate && <UpdateRecommendation selected={selected} onClose={() => setShowUpdate(false)} onUpdate={(updatedRec) => { handleUpdate(updatedRec); setShowUpdate(false); }} />}
      {showDelete && <ConfirmModal isOpen={showDelete} title="Archive Protocol?" message="This will remove the recommendation from the database." onConfirm={() => { if (deleteId) handleDelete(deleteId); setShowDelete(true); }} onCancel={() => setShowDelete(false)} />}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "40px", minHeight: "100vh", backgroundColor: "#fcfcfd" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  addButton: { padding: "12px 24px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" },
  searchWrapper: { display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", backgroundColor: "#f8fafc", borderRadius: "14px", flex: 1, maxWidth: "450px", height: "48px", border: "1px solid #f1f5f9" },
  searchInput: { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#0f172a", fontWeight: 500 },
  filterDropdownTrigger: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "0 18px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", height: "48px", minWidth: "180px", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "#0f172a" },
  dropdownMenu: { position: "absolute", top: "56px", right: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 15px 35px -5px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden", padding: "6px" },
  dropdownItem: { padding: "12px 14px", fontSize: "13.5px", fontWeight: 600, color: "#64748b", cursor: "pointer", borderRadius: "10px" },
  tableWrapper: { borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff", border: "1px solid #f1f5f9" },
  pageInfo: { fontSize: "13px", color: "#94a3b8", fontWeight: 500 },
  paginationControls: { display: "flex", alignItems: "center", gap: "10px" },
  pageBtn: { background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", color: "#64748b", display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" },
};