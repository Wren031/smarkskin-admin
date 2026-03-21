import { useState } from "react";
import TitleSize from "../../../styles/TitleSize";
import ConditionCard from "../components/ConditionCard";
import AddConditionModal from "../components/AddConditionModal";
import { FaPlus, FaSearch } from "react-icons/fa";
import useCondition from "../hooks/useCondition";
import styles from "../style/styles";

// ✅ IMPORT REUSABLE COMPONENTS
import PageLoader from "../../../components/PageLoader";
import SkeletonCards from "../components/SkeletonCards";

export default function SkinCondition() {
  const {
    conditions,
    showAdd,
    setShowAdd,
    addCondition,
    updateCondition,
    deleteCondition,
    loading,
  } = useCondition();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredConditions = conditions.filter((condition) =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.main_content}>

      <PageLoader loading={loading} text="Loading conditions..." />

      <div style={styles.header}>
        <TitleSize
          title="Skin Condition Management"
          subtitle="Manage condition-based recommendations used by the facial health AI"
        />

        <button
          style={styles.addButton}
          onClick={() => setShowAdd(true)}
        >
          <FaPlus /> Add New Condition
        </button>
      </div>

      <div style={styles.searchContainer}>
        <FaSearch />
        <input
          type="text"
          placeholder="Search condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* 🔥 SKELETON OR CONTENT */}
      <div style={styles.card_container}>
        {loading ? (
          <SkeletonCards count={6} />
        ) : (
          filteredConditions.map((condition) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
              onUpdate={updateCondition}
              onDelete={deleteCondition}
            />
          ))
        )}
      </div>

      <AddConditionModal
        isOpen={showAdd}
        onCancel={() => setShowAdd(false)}
        onSubmit={addCondition}
      />
    </div>
  );
}