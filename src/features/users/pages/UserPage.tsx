import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import UsersTable from "../components/UsersTable";

import StatsCard from "../../products/components/StatCard";
import useUser from "../hooks/useUser";
import SearchContainer from "../../../components/SearchContainer";
import TitleSize from "../../../styles/TitleSize";
export default function UserPage() {

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All Gender");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

const { users, totalUsers, activeUser, inActiveUser } = useUser();

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.fullname.toLowerCase().includes(keyword) ||
        user.address.toLowerCase().includes(keyword) ||
        user.contact.includes(keyword);

      const matchesGender =
        genderFilter === "All Gender" || user.gender === genderFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [search, genderFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={styles.page}>

    <TitleSize 
      title="User Management"
      subtitle="Monitor and manage registered users"
    />


      <div style={styles.statsContainer}>

        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
        />

        <StatsCard
          title="Active Users"
          value={activeUser}
          icon={UserCheck}
        />

        <StatsCard
          title="Inactive Users"
          value={inActiveUser}
          icon={UserX}
        />

      </div>

      <div style={styles.mainCard}>

        <div style={styles.filterBar}>
            <SearchContainer
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
            />

        </div>

        <UsersTable users={paginatedUsers} />

        <div style={styles.pagination}>
          <span style={{ color: "#64748b" }}>
            Page {currentPage} of {totalPages || 1}
          </span>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={styles.pagerBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              style={styles.pagerBtn}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    background: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  headerSub: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 30,
  },
  statsContainer: {
    display: "flex",
    gap: 10,
    marginBottom: 4,
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
  },
  mainCard: {
    background: "#ffffff",

  },
  filterBar: {

    display: "flex",
    gap: 15,
    marginBottom: 20,
  },
  pagination: {
    padding: "18px 20px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pagerBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    cursor: "pointer",
  },
};