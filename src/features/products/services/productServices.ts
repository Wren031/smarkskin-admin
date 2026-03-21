import { supabase } from "../../../lib/supabase";
import type { Products } from "../types/Products";

export const productServices = {
  async getAll(): Promise<Products[]> {
    const { data, error } = await supabase
      .from("tbl_products")
      .select("*");

    if (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }

    return data ?? [];
  },

  async uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${Math.random()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async create(product: Omit<Products, "id">): Promise<Products | null> {
    const { data, error } = await supabase
      .from("tbl_products")
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error.message);
      return null;
    }

    return data;
  },

  async update(id: number, updates: Partial<Products>): Promise<Products | null> {
    const { data, error } = await supabase
      .from("tbl_products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error.message);
      return null;
    }

    return data;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("tbl_products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error.message);
      return false;
    }

    return true;
  },
};