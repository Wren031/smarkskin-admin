// src/features/scan/services/skin_result.ts
import { supabase } from "../../../lib/supabase";

// src/features/scan/services/skin_result.ts
export const skinAdminService = {
  async getAllSkinResults() {
    try {
      const { data, error } = await supabase
        .from('tbl_skin_result')
        .select(`
          *,
          tbl_profiles (
            first_name,
            last_name
          ),
          tbl_skin_conditions (
            label,
            severity,
            impact
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Error Details:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Admin Fetch Error:', error);
      return [];
    }
  }
};