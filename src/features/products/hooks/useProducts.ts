import { useState, useEffect } from "react";
import type { Products } from "../types/Products";
import { productServices } from "../services/productServices";

export default function useProducts() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productServices.getAll();
    
    setProducts(data);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProduct = products.length;

  const availableProducts = products.filter(
    (p) => p.status === "Available"
  ).length;

  const outOfStock = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

    const addProduct = async (product: Omit<Products, "id">) => {
      const newProduct = await productServices.create(product);

      if (!newProduct) {
        throw new Error("Insert failed");
      }

      await fetchProducts();
    };

  const updateProduct = async (updatedProduct: Products) => {
    const updated = await productServices.update(
      updatedProduct.id,
      updatedProduct
    );

    if (updated) {
      await fetchProducts();
    }
  };

  const deleteProduct = async (id: number) => {
    const success = await productServices.delete(id);

    if (success) {
      await fetchProducts();
    }
  };

  return {
    loading,

    // data
    products,
    totalProduct,
    availableProducts,
    outOfStock,

    // actions
    addProduct,
    updateProduct,
    deleteProduct,

    fetchProducts,
  };
}