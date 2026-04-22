import { useState, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { Plus, ChevronDown, Check, Filter } from "lucide-react";

import SearchContainer from "../../../components/SearchContainer";
import useProducts from "../hooks/useProducts";
import TitleSize from "../../../styles/TitleSize";

import AddProductModal from "../components/AddProductModal";

import ProductCardList from "../components/ProductCardList";
import type { Products } from "../types/Products"; // Ensure types are imported
import EditProductDrawer from "../components/ProductFormDrawer";

export default function ProductPage() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  
  // Modal/Drawer States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
    return ["All", ...uniqueBrands.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.product_name?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [products, search, selectedBrand]);

  // Handler for when the "Edit" button is clicked on a card
  const handleEditInitiated = (product: Products) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  return (
    <div style={styles.container}>
      <style>{`
        .add-btn { transition: all 0.2s ease; background: #09090b; border-radius: 10px; cursor: pointer; color: white; border: none; }
        .add-btn:hover { background: #27272a; transform: translateY(-1px); }

        .dropdown-trigger {
          transition: all 0.2s ease;
          background: white;
          border: 1px solid #e4e4e7;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #18181b;
        }
        .dropdown-trigger:hover { border-color: #09090b; background: #fafafa; }
        .dropdown-trigger.active { border-color: #09090b; ring: 2px solid #09090b; }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 240px;
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          z-index: 50;
          overflow: hidden;
          animation: slideIn 0.2s ease-out;
        }

        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #71717a;
          transition: all 0.15s ease;
        }

        .dropdown-item:hover { background: #f4f4f5; color: #18181b; }
        .dropdown-item.selected { background: #09090b; color: white; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* HEADER */}
      <div style={styles.header}>
        <TitleSize
          title="Inventory Hub"
          subtitle="Manage your professional product catalog and stock."
        />
        <button className="add-btn" style={styles.addButton} onClick={() => setIsAddOpen(true)}>
          <Plus size={18} strokeWidth={2.5} /> Create Product
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={styles.toolbarContainer}>
        <div style={styles.searchWrapper}>
          <SearchContainer
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />
        </div>

        <div style={styles.filterActions}>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button 
              className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
              style={styles.dropdownTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Filter size={16} color="#71717a" />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={styles.label}>Brand:</span>
                <span style={styles.value}> {selectedBrand}</span>
              </div>
              <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div style={styles.dropdownHeader}>Select Brand</div>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    className={`dropdown-item ${selectedBrand === brand ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {brand}
                    {selectedBrand === brand && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.resultBadge}>
            <span style={styles.resultCount}>{filteredProducts.length}</span>
            <span style={styles.resultText}>Items</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.contentWrapper}>
        <ProductCardList 
          products={filteredProducts} 
          onDelete={deleteProduct} 
          onUpdate={handleEditInitiated} // Now opens the Drawer
          loading={loading} 
        />
      </div>

      {/* DRAWER & MODAL COMPONENTS */}
      <AddProductModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={addProduct} 
      />

      <EditProductDrawer
        isOpen={isEditOpen}
        product={editingProduct}
        onClose={() => {
          setIsEditOpen(false);
          setEditingProduct(null);
        }}
        onUpdate={updateProduct}
      />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding: "40px clamp(16px, 5vw, 60px)",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  addButton: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  toolbarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f4f4f5",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: 1,
    minWidth: "300px",
    maxWidth: "500px",
  },
  filterActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dropdownTrigger: {
    padding: "10px 16px",
    borderRadius: "10px",
    minWidth: "200px",
    fontSize: "14px",
  },
  label: { color: "#71717a", fontWeight: 400 },
  value: { color: "#09090b", fontWeight: 600 },
  dropdownHeader: {
    padding: "12px 16px 8px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  resultBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    background: "#f4f4f5",
    borderRadius: "10px",
  },
  resultCount: { fontWeight: 800, color: "#09090b", fontSize: "14px" },
  resultText: { color: "#71717a", fontSize: "14px", fontWeight: 500 },
  contentWrapper: { marginTop: "12px" },
};