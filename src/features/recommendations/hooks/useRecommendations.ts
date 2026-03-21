import { useEffect, useState } from "react";
import type { Recommendation } from "../types/Recommendation";
import { recommendationService } from "../services/recommendationService";
import { delay } from "../../../utils/delay";

export default function useRecommendations() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Recommendation | null>(null);


  const fetchData = async () => {
    const start = Date.now();

    try {
      setLoading(true);

      const result = await recommendationService.getAll();

      const elapsed = Date.now() - start;

      if (elapsed < 500) {
        await delay(500 - elapsed);
      }

      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAdd = async (newRec: Recommendation) => {
    try {
      await recommendationService.create(newRec);

      await fetchData();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // =========================
  // 🔄 UPDATE
  // =========================
  const handleUpdate = async (updatedRec: Recommendation) => {
    try {
      await recommendationService.update(updatedRec);

      await fetchData();
      setSelected(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await recommendationService.delete(id);

      await fetchData();
      alert("Recommendation deleted successfully ✅");
      
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  const handleEdit = (rec: Recommendation) => {
    setSelected(rec);
  };

  return {
    data,
    loading,
    selected,
    setSelected,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleEdit,
  };
}