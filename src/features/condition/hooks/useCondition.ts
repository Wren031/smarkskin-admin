import { useState, useEffect } from "react";
import type { SkinCondition } from "../type/SkinCondition";
import { conditionService } from "../services/conditionService";
import { delay } from "../../../utils/delay";

export default function useCondition() {
  const [conditions, setConditions] = useState<SkinCondition[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true)
  const start = Date.now();

  const totalCondition = conditions.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await conditionService.getAll();
        const elapsed = Date.now() - start;

        if (elapsed < 1000) {
          await delay(1000 - elapsed);
        }

        setConditions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addCondition = async (name: string) => {
    const newCondition = await conditionService.create(name);
    setConditions((prev) => [newCondition, ...prev]);
  };

  const updateCondition = async (id: number, name: string) => {
    const updated = await conditionService.update(id, name);

    setConditions((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );
  };

  const deleteCondition = async (id: number) => {
    await conditionService.remove(id);
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    totalCondition,
    conditions,
    loading, // ✅ IMPORTANT (you forgot this before)
    showAdd,
    setShowAdd,
    addCondition,
    updateCondition,
    deleteCondition,
  };
}