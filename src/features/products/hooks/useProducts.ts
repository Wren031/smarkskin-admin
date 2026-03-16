import { useState } from "react";
import type { Products } from "../types/Products";
import { products as initialProducts } from "../data/products";

export default function useProducts() {

  const [products, setProducts] = useState<Products[]>(initialProducts);

  const totalProduct = products.length;

  const availableProducts = products.filter(
    (product) => product.status == "Available"
  ).length;

  const outOfStock = products.filter(
    (product) => product.status == "Out of Stock"
  ).length;


  // selected product (view/edit)
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

  // modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);



  const [deleteId, setDeleteId] = useState<number | null>(null);

  // -------------------------
  // ADD PRODUCT
  // -------------------------
  const addProduct = (product: Omit<Products, "id">) => {
    const newProduct: Products = {
      ...product,
      id: Date.now(),
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  // -------------------------
  // UPDATE PRODUCT
  // -------------------------
  const updateProduct = (updatedProduct: Products) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteId)
      );

      setDeleteId(null);
    }
  };

  // -------------------------
  // VIEW PRODUCT
  // -------------------------
  const openViewModal = (product: Products) => {
    setSelectedProduct(product);
    console.log("ss")
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setSelectedProduct(null);
    setIsViewOpen(false);
  };

  // -------------------------
  // EDIT PRODUCT
  // -------------------------
  const openEditModal = (product: Products) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditOpen(false);
  };

  return {
    totalProduct,
    availableProducts,
    outOfStock,

    products,
    selectedProduct,

    // modal states
    isAddOpen,
    isEditOpen,
    isViewOpen,
    deleteId,


    // modal setters
    setIsAddOpen,

    // actions
    addProduct,
    updateProduct,

    openDeleteModal,
    closeDeleteModal,
    confirmDelete,

    openViewModal,
    closeViewModal,

    

    openEditModal,
    closeEditModal,
  };
}