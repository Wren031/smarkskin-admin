import { useState } from "react";
import type { CSSProperties } from "react";

import StatsCard from "../components/StatCard";
import SearchContainer from "../../../components/SearchContainer";
import useProducts from "../hooks/useProducts";
import TitleSize from "../../../styles/TitleSize";
import { FaPlus, FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AddProductModal from "../components/AddProductModal";



import SkeletonTable from "../../../components/SkeletonTable";
import usePageLoading from "../../../components/hooks/usePageLoading";
import ProductTable from "../components/ProductTable";
export default function ProductPage() {
  const {
    products,
    totalProduct,
    availableProducts,
    outOfStock,
    addProduct,
    deleteProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { loading } = usePageLoading(1200);

  const filteredProducts = products.filter((product) => {
    const name = product.product_name?.toLowerCase() || "";
    const matchesSearch = name.includes(search.toLowerCase());


    return matchesSearch;
  });

  return (
    <div style={styles.container}>


      <div style={styles.header}>
        <TitleSize
          title="Products Management"
          subtitle="Manage and monitor your product inventory"
        />

        <button style={styles.addButton} onClick={() => setIsAddOpen(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div style={styles.statsContainer}>
        <StatsCard title="Total Products" value={totalProduct} icon={FaBoxOpen} />
        <StatsCard title="Available Products" value={availableProducts} icon={FaCheckCircle} />
        <StatsCard title="Out of Stock" value={outOfStock} icon={FaTimesCircle} />
      </div>

      <div style={styles.mainContent}>
        <div style={styles.filterContainer}>
          <SearchContainer
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

        </div>

        <div style={styles.tableContainer}>
          {loading ? (
            <SkeletonTable columns={["20%", "40%", "24%", "16%"]} rows={6} />
          ) : (
            <ProductTable products={filteredProducts} onDelete={deleteProduct} />
          )}
        </div>

        <AddProductModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={addProduct}
        />
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    padding: "clamp(12px, 2vw, 24px)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
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
  },

  mainContent: {
    background: "white",
    marginTop: 10,
  },

  statsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
  },

  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginTop: "12px",
  },

  select: {
    height: 45,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #f1f5f9",
  },

  tableContainer: {
    marginTop: 20,
  },
};