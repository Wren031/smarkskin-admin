import { useState } from "react";
import type { CSSProperties } from "react";

import ProductTable from "../components/ProductTable";
import DeleteModal from "../components/DeleteModal";
import AddProductModal from "../components/AddProductModal";
import ViewProductModal from "../components/ViewProductModal";
import StatsCard from "../components/StatCard";

import SearchContainer from "../../../components/SearchContainer";
import useProducts from "../hooks/useProducts";
import TitleSize from "../../../styles/TitleSize";
import { FaPlus, FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ProductPage() {
  const {
    totalProduct,
    availableProducts,
    outOfStock,
    products,
    deleteId,
    isAddOpen,
    selectedProduct,
    isViewOpen,

    setIsAddOpen,
    closeViewModal,
    updateProduct,
    addProduct,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    openViewModal,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProducts = products.filter((product) => {
    const name = product.product_name?.toLowerCase() || "";

    const matchesSearch = name.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>


        <TitleSize 
          title="Product's Management"
          subtitle="Manage and monitor your product inventory"
          />
    

        <button
          style={styles.addButton}
          onClick={() => setIsAddOpen(true)}
        >
          <FaPlus /> Add Product
        </button>
      </div>


      <div style={styles.statsContainer}>
        <StatsCard
          title="Total Products"
          value={totalProduct}
          icon={FaBoxOpen}
        />

        <StatsCard
          title="Available Products"
          value={availableProducts}
          icon={FaCheckCircle}
        />

        <StatsCard
          title="Out of Stock"
          value={outOfStock}
          icon={FaTimesCircle}
        />
      </div>

      <div style={styles.mainContent}>
        <div style={styles.filterContainer}>
                <SearchContainer
                  value={search}
                  onChange={setSearch}
                  placeholder="Search products..."
                />

                <select
                  style={styles.select}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Product Table */}
              <div style={styles.tableContainer}>
                <ProductTable
                  products={filteredProducts}
                  onDelete={openDeleteModal}
                  onView={openViewModal}
                />
              </div>

              {/* Modals */}
              <DeleteModal
                isOpen={deleteId !== null}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
              />

              <AddProductModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={addProduct}
              />

              <ViewProductModal
                product={selectedProduct}
                isOpen={isViewOpen}
                onClose={closeViewModal}
                onUpdate={updateProduct}
              />
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: -0.2,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
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

  mainContent:{
    background: "white",
    overflow: "hidden",
    marginTop: 5,
  },

  statsContainer: {
    display: "flex",
    gap: 10,
  },

  filterContainer: {

    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  select: {
    height: 45,
    marginTop: 45,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #f1f5f9",
    fontSize: 14,
  },

  tableContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
  },
};