import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  UserX,
  RotateCcw,
} from "lucide-react";
import UsersTable from "../components/UsersTable";
import StatsCard from "../../products/components/StatCard";
import useUser from "../hooks/useUser";
import TitleSize from "../../../styles/TitleSize";
import PageLoader from "../../../components/PageLoader";

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { users, loading } = useUser();

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
      const fullName =
        `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();

      const matchesSearch = fullName.includes(search.toLowerCase());

      const matchesGender =
        genderFilter === "All" || user.gender === genderFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [users, search, genderFilter, statusFilter]);


  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;

  return (
    <div style={styles.page}>
      <TitleSize
        title="User Management"
        subtitle="Monitor and manage registered users"
      />

      <PageLoader loading={loading} text="Loading conditions..." />

      <div style={styles.statsContainer}>
        <StatsCard title="Total Users" value={users.length} icon={Users} />
        <StatsCard title="Active Users" value={activeUsers} icon={UserCheck} />
        <StatsCard title="Inactive Users" value={inactiveUsers} icon={UserX} />
      </div>

      <div style={styles.mainCard}>
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            style={styles.select}
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g === "All" ? "All Gender" : g}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Status" : s}
              </option>
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

        <UsersTable users={filteredUsers} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    background: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "clamp(12px, 2vw, 24px)",
  },

  statsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
  },

  mainCard: {
    marginTop: 20,
  },

  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    marginBottom: 16,
  },

  searchInput: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    minWidth: 220,
    outline: "none",
  },

  select: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
  },

  clearBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
    iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

};