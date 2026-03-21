import { supabase } from "../../../lib/supabase";
import type { User } from "../typs/User";

export const adminService = {

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("tbl_profiles")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      throw error;
    }

    return data ?? [];
  },

};