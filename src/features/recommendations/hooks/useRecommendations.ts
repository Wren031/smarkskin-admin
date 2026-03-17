import { useState } from "react";
import type { Recommendation } from "../types/Recommendation";
import { recommendation as initialData } from "../data/recommendations";

export default function useRecommendations() {
  const [data, setData] = useState<Recommendation[]>(initialData);
  const [selected, setSelected] = useState<Recommendation | null>(null);


  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };


  const handleEdit = (rec: Recommendation) => {
    setSelected(rec);
  };


  const handleUpdate = (updatedRec: Recommendation) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedRec.id ? updatedRec : item
      )
    );

    setSelected(null);
  };

  return {
    data,
    selected,
    handleDelete,
    handleEdit,
    handleUpdate,
    setSelected, 
  };
}