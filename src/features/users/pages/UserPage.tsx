import { useState, useMemo, useEffect } from "react";
import { Users, UserCheck, UserX, RotateCcw } from "lucide-react";
import UsersTable from "../components/UsersTable";
import StatsCard from "../../products/components/StatCard";
import useUser from "../hooks/useUser";
import TitleSize from "../../../styles/TitleSize";
import ViewUserPage from "./ViewUserPage";


export default function UserPage() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { users, selectedUser, loading, getUserById } = useUser();


  const genders = useMemo(
    () => ["All", ...Array.from(new Set(users.map((u) => u.gender)))],
    [users]
  );

  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(users.map((u) => u.status)))],
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesGender = genderFilter === "All" || user.gender === genderFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [users, search, genderFilter, statusFilter]);

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;


  if (loading && !users.length) return <p>Loading...</p>;

  if (selectedUser) {
      return (
        <div style={styles.page}>

          <ViewUserPage user={selectedUser} />
        </div>
      );
    }

  return (
    <div style={styles.page}>
      <TitleSize
        title="User Management"
        subtitle="Monitor and manage registered users"
      />

      

      <div style={{
        ...styles.statsContainer,
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))"
      }}>
        <StatsCard title="Total" value={users.length} icon={Users} />
        <StatsCard title="Active" value={activeUsers} icon={UserCheck} />
        <StatsCard title="Inactive" value={inactiveUsers} icon={UserX} />
        <StatsCard title="Total List" value={users.length} icon={Users} />
      </div>

      <div style={styles.mainCard}>
        <div style={{
          ...styles.filterBar,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...styles.searchInput,
              width: isMobile ? "100%" : "350px",
              flex: "none" 
            }}
          />

          <div style={{ display: "flex", gap: "10px", flex: isMobile ? "none" : "unset" }}>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{ ...styles.select, flex: 1 }}
            >
              {genders.map((g) => (
                <option key={g} value={g}>{g === "All" ? "All Gender" : g}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...styles.select, flex: 1 }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch("");
                setGenderFilter("All");
                setStatusFilter("All");
              }}
              style={styles.iconBtn}
              title="Clear filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto", borderRadius: "8px" }}>
          <UsersTable 
            users={filteredUsers} 
            onView={async (user) => {
              await getUserById(user.id); 
            }} 
        />
        </div>
      </div>
    </div>
  );
}

// Added backBtn to your styles
const styles: { [key: string]: React.CSSProperties } = {
  // ... existing styles ...
  page: {
    background: "#ffffff",
    padding: "clamp(12px, 2vw, 24px)",
  },
  statsContainer: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  mainCard: {
    marginTop: 24,
  },
  filterBar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    width: "350px",
  },
  select: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
    minWidth: "120px"
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    marginBottom: "20px",
    border: "none",
    background: "none",
    color: "#2563eb",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
  }
};