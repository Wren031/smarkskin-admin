import { useState, useEffect, useCallback, useMemo } from "react";
import { conditionService } from "../services/conditionService";
import { delay } from "../../../utils/delay";

export default function useCondition() {
  const [conditions, setConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const totalConditions = useMemo(() => conditions.length, [conditions]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      const data = await conditionService.getAll();
      
      // Professional feel: ensure skeleton shows for at least 800ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) await delay(800 - elapsed);

      setConditions(data);
    } catch (error) {
      console.error("Failed to fetch conditions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCondition = async (name: string) => {
    try {
      const newCondition = await conditionService.create(name);
      setConditions((prev) => [newCondition, ...prev]);
    } catch (error) {
      console.error("Error adding condition:", error);
    }
  };

  const updateCondition = async (id: any, name: string) => {
    try {
      const updated = await conditionService.update(id, name);
      setConditions((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (error) {
      console.error("Error updating condition:", error);
    }
  };

  const deleteCondition = async (id: any) => {
    try {
      await conditionService.remove(id);
      setConditions((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting condition:", error);
    }
  };

  return {
    conditions,
    totalConditions,
    loading,
    showAdd,
    setShowAdd,
    addCondition,
    updateCondition,
    deleteCondition,
  };
}