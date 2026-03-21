import { supabase } from "../../../lib/supabase";
import type { Recommendation } from "../types/Recommendation";

export const recommendationService = {

  async getAll(): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from("tbl_recommendations")
      .select(`
        id,
        severity,
        treatment,
        precautions,
        created_at,
        tbl_condition (
          id,
          name,
          created_at
        ),
        tbl_recommendation_products (
          tbl_products (
            id,
            product_name,
            brand,
            price,
            image_url,
            description,
            status
          )
        )
      `);

    if (error) throw error;
    if (!data) return [];

    return data.map((rec: any) => ({
      id: rec.id,
      severity: rec.severity,
      treatment: rec.treatment,
      precautions: rec.precautions,
      createdAt: rec.created_at,

      condition: {
        id: rec.tbl_condition?.id,
        name: rec.tbl_condition?.name,
        created_at: rec.tbl_condition?.created_at,
      },

      products:
        rec.tbl_recommendation_products?.map((rp: any) => ({
          id: rp.tbl_products.id,
          product_name: rp.tbl_products.product_name,
          brand: rp.tbl_products.brand,
          price: rp.tbl_products.price,
          image_url: rp.tbl_products.image_url,
          description: rp.tbl_products.description,
          status: rp.tbl_products.status,
        })) || [],
    }));
  },

  // =========================
  // ➕ CREATE
  // =========================
  async create(rec: Recommendation): Promise<Recommendation> {
    const { data, error } = await supabase
      .from("tbl_recommendations")
      .insert({
        condition_id: rec.condition.id,
        severity: rec.severity,
        treatment: rec.treatment,
        precautions: rec.precautions,
      })
      .select()
      .single();

    if (error) throw error;

    if (rec.products?.length) {
      const links = rec.products.map((p) => ({
        recommendation_id: data.id,
        product_id: p.id,
      }));

      const { error: linkError } = await supabase
        .from("tbl_recommendation_products")
        .insert(links);

      if (linkError) throw linkError;
    }

    return {
      ...rec,
      id: data.id,
      createdAt: data.created_at,
    };
  },

  // =========================
  // 🔄 UPDATE (WITH PRODUCT SYNC)
  // =========================
  async update(rec: Recommendation): Promise<Recommendation> {
    // 1️⃣ Update main record
    const { error } = await supabase
      .from("tbl_recommendations")
      .update({
        condition_id: rec.condition.id,
        severity: rec.severity,
        treatment: rec.treatment,
        precautions: rec.precautions,
      })
      .eq("id", rec.id);

    if (error) throw error;

    // 2️⃣ DELETE old product links
    const { error: deleteError } = await supabase
      .from("tbl_recommendation_products")
      .delete()
      .eq("recommendation_id", rec.id);

    if (deleteError) throw deleteError;

    // 3️⃣ INSERT new product links
    if (rec.products?.length) {
      const links = rec.products.map((p) => ({
        recommendation_id: rec.id,
        product_id: p.id,
      }));

      const { error: insertError } = await supabase
        .from("tbl_recommendation_products")
        .insert(links);

      if (insertError) throw insertError;
    }

    return rec;
  },

  // =========================
  // ❌ DELETE
  // =========================
  async delete(id: number): Promise<void> {
    // delete recommendation (join table auto deletes if cascade is set)
    const { error } = await supabase
      .from("tbl_recommendations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};