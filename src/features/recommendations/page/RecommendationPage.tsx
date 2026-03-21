import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

import StatsCard from "../../products/components/StatCard";
import TitleSize from "../../../styles/TitleSize";
import RecommendationTable from "../components/RecommendationTable";
import AddRecommendationsPage from "./AddRecommendationsPage";
import UpdateRecommendation from "../components/UpdateRecommendation";
import useRecommendations from "../hooks/useRecommendations";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
} from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import PageLoader from "../../../components/PageLoader";

export default function RecommendationPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);


  const navigate = useNavigate();

  const {
    data,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleAdd,
    selected,
    loading,
    setSelected,
  } = useRecommendations();

  // 🔍 FILTER
  const filteredData = data.filter((rec) =>
    [rec.condition, rec.severity, rec.treatment]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerContainer}>
        <PageLoader loading={loading} text="Loading products..." />
        <TitleSize
          title="AI Treatment Plan Management"
          subtitle="Manage condition-based recommendations used by the facial health AI"
        />

        <button style={styles.addButton} onClick={() => navigate("/recommendation/add")}>
         <FaPlus /> Add New Recommendations
        </button>

      </div>

      {/* STATS */}
      <div style={styles.statsContainer}>
        <StatsCard
          title="Total Recommendations"
          value={data.length}
          icon={FaBoxOpen}
        />

        <StatsCard
          title="Conditions Covered"
          value={data.length}
          icon={FaCheckCircle}
        />

        <StatsCard
          title="High Severity Rules"
          value={data.filter((d) => d.severity === "Severe").length}
          icon={FaTimesCircle}
        />
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search recommendations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>



      <RecommendationTable
        recommendation={filteredData}
        onEdit={(rec) => {
          handleEdit(rec);    
          setShowUpdate(true);   
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setShowDelete(true);
        }}
        onView={(rec) => navigate(`/view/${rec.id}`)}
      />

      {showAdd && (
      <AddRecommendationsPage
        onAdd={(newRec) => {
          handleAdd(newRec);
          setShowAdd(false);
        }}
        // onCancel={() => setShowAdd(false)}
      />
      )}

      {showUpdate && selected && (
        <UpdateRecommendation
          data={selected}
          onClose={() => {
            setShowUpdate(false);
            setSelected(null);
          }}
          onUpdate={handleUpdate}
        />
      )}


    {showDelete && (
      <ConfirmModal
        isOpen={showDelete}
        title="Delete Recommendation"
        message="Are you sure you want to delete this recommendation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setShowDelete(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId !== null) {
            handleDelete(deleteId);
          }
          setShowDelete(false);
          setDeleteId(null);
        }}
      />
    )}

    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    padding: "clamp(12px, 2vw, 24px)",
  },

  // ✅ HEADER FIX
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // 🔥 allows stacking
    gap: "12px",
  },

  addButton: {
    padding: "10px 16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "clamp(12px, 1.5vw, 14px)",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },

  // ✅ STATS FIX
  statsContainer: {
    display: "flex",
    flexWrap: "wrap", // 🔥 key fix
    gap: "12px",
    marginTop: "16px",
  },

  // ✅ SEARCH FIX
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },

  searchInput: {
    padding: "10px",
    width: "100%", // 🔥 full width on mobile
    maxWidth: "400px", // keeps it nice on desktop
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: "clamp(12px, 1.5vw, 14px)",
  },
};