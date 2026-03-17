import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import StatsCard from "../../products/components/StatCard";
import TitleSize from "../../../styles/TitleSize";
import RecommendationTable from "../components/RecommendationTable";
import useRecommendations from "../hooks/useRecommendations";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
} from "react-icons/fa";

export default function RecommendationPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, handleDelete, handleEdit } = useRecommendations();

  // 🔍 Filter data
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
        <TitleSize
          title="AI Treatment Plan Management"
          subtitle="Manage condition-based recommendations used by the facial health AI"
        />

        <button style={styles.addButton}>
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

      {/* SEARCH */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search recommendations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* TABLE */}
      <RecommendationTable
        recommendation={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(rec) => navigate(`/view/${rec.id}`)} // ✅ router navigation
      />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    padding: 20,
  },

  statsContainer: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },

  addButton: {
    padding: "10px 16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchInput: {
    padding: "10px",
    width: "300px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
};