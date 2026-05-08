import { useState, useEffect, useMemo, useRef } from "react"; // Removed Activity from here
import type { CSSProperties } from "react";
import { Plus, ChevronDown, Check, Filter, Activity } from "lucide-react"; // Added Activity here

import SearchContainer from "../../../components/SearchContainer";
import useProducts from "../hooks/useProducts";
import TitleSize from "../../../styles/TitleSize";

import ProductCardList from "../components/ProductCardList";
import type { Products } from "../types/Products";
import EditProductDrawer from "../components/EditProductDrawer";
import AddProductDrawer from "../components/AddProductModal";

export default function ProductPage() {
  const { products = [], addProduct, deleteProduct, updateProduct } = useProducts();
  
  // 1. All State Hooks at the top
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. All Effect Hooks
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

  // 3. All Memo/Callback Hooks
  const brands = useMemo(() => {
    // Ensure products is an array before mapping
    const uniqueBrands = Array.from(new Set(products.map((p) => p.type))).filter(Boolean);
    return ["All", ...uniqueBrands.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.product_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
                            (product.type?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesBrand = selectedBrand === "All" || product.type === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [products, search, selectedBrand]);

  const handleEditInitiated = (product: Products) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  // 4. Early return AFTER hooks are declared
  if (loading) return (
    <div style={styles.center}>
      <Activity className="animate-spin" color="#0f172a" />
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; }
        .toolbar-container { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #f4f4f5; }
        
        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .add-btn { width: 100%; justify-content: center; }
          .toolbar-container { flex-direction: column; align-items: stretch; }
          .search-wrapper { max-width: none !important; width: 100%; }
          .filter-actions { width: 100%; flex-direction: column; align-items: stretch !important; }
          .dropdown-trigger { width: 100%; }
          .dropdown-menu { width: 100% !important; }
        }

        .add-btn { transition: all 0.2s ease; background: #09090b; border-radius: 10px; cursor: pointer; color: white; border: none; padding: 12px 24px; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .add-btn:hover { background: #27272a; transform: translateY(-1px); }
        .dropdown-trigger { transition: all 0.2s ease; background: white; border: 1px solid #e4e4e7; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; color: #18181b; padding: 10px 16px; min-width: 200px; }
        .dropdown-menu { position: absolute; top: calc(100% + 8px); left: 0; width: 240px; background: white; border: 1px solid #e4e4e7; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); z-index: 50; overflow: hidden; animation: slideIn 0.2s ease-out; }
        .dropdown-item { width: 100%; padding: 12px 16px; border: none; background: none; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 14px; color: #71717a; transition: all 0.15s ease; }
        .dropdown-item:hover { background: #f4f4f5; color: #18181b; }
        .dropdown-item.selected { background: #09090b; color: white; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="page-header">
        <TitleSize title="Manage Products" subtitle="Manage your professional product catalog and stock." />
        <button className="add-btn" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} strokeWidth={2.5} /> Create Product
        </button>
      </div>

      <div className="toolbar-container">
        <div className="search-wrapper" style={styles.searchWrapper}>
          <SearchContainer value={search} onChange={setSearch} placeholder="Search products..." />
        </div>

        <div className="filter-actions" style={styles.filterActions}>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button 
              className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
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

      <div style={styles.contentWrapper}>
        <ProductCardList 
          products={filteredProducts} 
          onDelete={deleteProduct} 
          onUpdate={handleEditInitiated} 
          loading={loading} 
        />
      </div>

      <AddProductDrawer 
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
  container: { minHeight: "100vh", padding: "clamp(16px, 4vw, 32px)", background: "#fcfcfd", fontFamily: "'Inter', sans-serif" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  searchWrapper: { flex: 1, minWidth: "300px", maxWidth: "500px" },
  filterActions: { display: "flex", alignItems: "center", gap: "12px" },
  label: { color: "#71717a", fontWeight: 400 },
  value: { color: "#09090b", fontWeight: 600 },
  dropdownHeader: { padding: "12px 16px 8px", fontSize: "12px", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em" },
  resultBadge: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "#f4f4f5", borderRadius: "10px", justifyContent: "center" },
  resultCount: { fontWeight: 800, color: "#09090b", fontSize: "14px" },
  resultText: { color: "#71717a", fontSize: "14px", fontWeight: 500 },
  contentWrapper: { marginTop: "12px" },
};