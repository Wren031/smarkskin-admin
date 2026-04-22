import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Users, UserX, Search, Filter, 
  TrendingUp, BarChart3, Activity, Archive,
  ChevronDown, type LucideIcon 
} from "lucide-react";

import useUser from "../hooks/useUser";
import TitleSize from "../../../styles/TitleSize";
import UsersTable from "../components/UsersTable";
import UserDetailDrawer from "../components/UserDetailDrawer";
import type { CSSProperties } from "react";

// --- TYPES ---

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  type?: 'active' | 'inactive' | 'default';
}

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, trend, type = 'default' }: StatCardProps) => (
  <div style={styles.statCard}>
    <div style={styles.statHeader}>
      <div style={{ ...styles.statIconWrapper, backgroundColor: `${color}12`, color: color }}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      {type === 'active' ? (
        <div style={{ ...styles.analyticsBadge, color: '#10b981', background: '#ecfdf5' }}>
          <span style={styles.pulseDot} />
          <span>Live Now</span>
        </div>
      ) : type === 'inactive' ? (
        <div style={{ ...styles.analyticsBadge, color: '#64748b', background: '#f1f5f9' }}>
          <Archive size={12} style={{ marginRight: '4px' }} />
          <span>Archived</span>
        </div>
      ) : (
        <div style={styles.analyticsBadge}>
          <TrendingUp size={12} style={{ marginRight: '4px' }} />
          <span>{trend || '+12%'}</span>
        </div>
      )}
    </div>
    <div style={styles.statBody}>
      <h3 style={styles.statValue}>{value.toLocaleString()}</h3>
      <span style={styles.statLabel}>{title}</span>
    </div>
    <BarChart3 size={40} style={styles.bgDecoration} />
  </div>
);

// --- MAIN PAGE ---

export default function UserPage() {
  const { users = [], selectedUser, loading, getUserById, clearSelection } = useUser();
  
  // Filtering & Dropdown State
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const genderOptions = ["All", "Male", "Female", "Other"];

  // Click-away listener for Custom Dropdown
  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    if (isDropdownOpen) window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  // Analytics Calculation
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status?.toLowerCase() === 'active').length,
    inactive: users.filter(u => u.status?.toLowerCase() === 'inactive').length
  }), [users]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || user.id.toString().includes(search);
      const matchesGender = genderFilter === "All" || user.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [users, search, genderFilter]);

  // Reset pagination on filter change
  useEffect(() => { setCurrentPage(1); }, [search, genderFilter]);

  // Pagination Math
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleViewUser = useCallback(async (user: any) => {
    await getUserById(user.id);
    setIsDrawerOpen(true);
  }, [getUserById]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    if (clearSelection) clearSelection();
  }, [clearSelection]);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.9; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filter-input:focus { 
          border-color: #6366f1 !important; 
          background: #fff !important; 
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); 
        }
        .dropdown-item:hover {
          background-color: #f8fafc !important;
          color: #6366f1 !important;
        }
      `}</style>

      <div style={styles.headerSection}>
        <TitleSize title="User Analytics" subtitle="Real-time monitoring of user demographics and status." />
      </div>

      {/* Analytics Grid */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Registry" value={stats.total} icon={Users} color="#6366f1" />
        <StatCard title="Active Patients" value={stats.active} icon={Activity} color="#10b981" type="active" />
        <StatCard title="Inactive Accounts" value={stats.inactive} icon={UserX} color="#ef4444" type="inactive" />
      </div>

      {/* Filter & Table Container */}
      <div style={styles.tableContainer}>
        <div style={styles.filterBar}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Modern Dropdown */}
          <div 
            style={styles.dropdownContainer} 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <div style={{...styles.dropdownTrigger, borderColor: isDropdownOpen ? '#6366f1' : '#e2e8f0'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Filter size={14} style={{color: isDropdownOpen ? '#6366f1' : '#94a3b8'}} />
                <span style={{fontSize: '14px', fontWeight: 600, color: '#1e293b'}}>
                  {genderFilter === 'All' ? 'All Genders' : genderFilter}
                </span>
              </div>
              <ChevronDown 
                size={14} 
                style={{
                  transition: 'transform 0.2s', 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: '#94a3b8'
                }} 
              />
            </div>

            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                {genderOptions.map((g) => (
                  <div
                    key={g}
                    className="dropdown-item"
                    onClick={() => setGenderFilter(g)}
                    style={{
                      ...styles.dropdownItem,
                      color: genderFilter === g ? '#6366f1' : '#64748b',
                      backgroundColor: genderFilter === g ? '#f5f7ff' : 'transparent'
                    }}
                  >
                    {g === "All" ? "All Genders" : g}
                    {genderFilter === g && <div style={styles.activeDot} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <UsersTable 
          users={currentData} 
          loading={loading} 
          onView={handleViewUser}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={filteredUsers.length}
        />
      </div>

      <UserDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        user={selectedUser} 
      />
    </div>
  );
}

// --- STYLES ---

const styles: Record<string, CSSProperties> = {
  page: { padding: "32px 48px", background: "#fdfdfe", minHeight: "100vh" },
  headerSection: { marginBottom: "32px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" },
  
  statCard: { 
    background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", 
    position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", 
    justifyContent: "space-between", minHeight: "140px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" 
  },
  statHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statIconWrapper: { width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  analyticsBadge: { display: "flex", alignItems: "center", fontSize: "11px", fontWeight: 700, background: "#f8fafc", padding: "4px 10px", borderRadius: "20px" },
  pulseDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", marginRight: "6px", animation: "pulse 2s infinite ease-in-out" },
  statBody: { zIndex: 2 },
  statLabel: { fontSize: "13px", color: "#64748b", fontWeight: 600 },
  statValue: { margin: 0, fontSize: "28px", fontWeight: 800, color: "#0f172a" },
  bgDecoration: { position: "absolute", bottom: "-10px", right: "-5px", color: "#f8fafc", zIndex: 1, transform: "rotate(-10deg)" },

  tableContainer: { background: "#fff", borderRadius: "24px", border: "1px solid #f1f5f9", overflow: "hidden" },
  filterBar: { padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  
  searchWrapper: { position: "relative", width: "380px", maxWidth: "100%" },
  searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
  searchInput: { width: "100%", padding: "12px 16px 12px 48px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none", transition: "all 0.2s" },

  // Dropdown Specific Styles
  dropdownContainer: { position: "relative", width: "190px", cursor: "pointer", userSelect: "none" },
  dropdownTrigger: { 
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    padding: "12px 16px", borderRadius: "14px", border: "1px solid #e2e8f0", 
    backgroundColor: "#fff", transition: "all 0.2s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
  },
  dropdownMenu: { 
    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, 
    backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", 
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "6px", zIndex: 100, 
    animation: "fadeIn 0.2s ease-out" 
  },
  dropdownItem: { 
    padding: "10px 12px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, 
    display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s ease" 
  },
  activeDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#6366f1" }
};