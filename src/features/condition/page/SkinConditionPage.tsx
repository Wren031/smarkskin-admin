import { useState, useMemo } from "react";
import TitleSize from "../../../styles/TitleSize";
import ConditionCard from "../components/ConditionCard";
import AddConditionModal from "../components/AddConditionModal";
import { Plus, Search } from "lucide-react";
import useCondition from "../hooks/useCondition";

const SkeletonCard = () => (
  <div style={pageStyles.skeleton} className="shimmer" />
);

export default function SkinConditionPage() {
  const { conditions, showAdd, setShowAdd, addCondition, updateCondition, deleteCondition, loading } = useCondition();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConditions = useMemo(() => {
    return conditions.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conditions, searchTerm]);

  return (
    <div style={pageStyles.container}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 2s infinite linear; }
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
      `}</style>

      <div style={pageStyles.header}>
        <TitleSize title="Condition Management" subtitle="Configure skin profiles for AI analysis" />
        <button style={pageStyles.addButton} onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add New
        </button>
      </div>

      <div style={pageStyles.searchBox}>
        <Search size={18} color="#94a3b8" />
        <input 
          style={pageStyles.searchInput} 
          placeholder="Search profiles..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="grid-layout">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
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

const pageStyles = {
  container: { padding: '32px', backgroundColor: '#fcfcfd', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
  addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', width: '320px', marginBottom: '32px' },
  searchInput: { border: 'none', padding: '12px 0', outline: 'none', width: '100%', fontSize: '14px' },
  skeleton: { height: '140px', borderRadius: '12px', border: '1px solid #e2e8f0' }
};