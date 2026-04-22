import { supabase } from "../../../lib/supabase";
import type { SkinCondition } from "../type/SkinCondition";

export const conditionService = {

  async getAll(): Promise<SkinCondition[]> {
    const { data, error } = await supabase
      .from("tbl_condition")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  },

    async create(name: string): Promise<SkinCondition> {
    const { data, error } = await supabase
        .from("tbl_condition")
        .insert([{ name }])
        .select()
        .single();

    console.log("INSERT RESULT:", { data, error });

    if (error) throw error;
    return data;
    },

  async update(id: number, name: string): Promise<SkinCondition> {
    const { data, error } = await supabase
      .from("tbl_condition")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase
      .from("tbl_condition")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};