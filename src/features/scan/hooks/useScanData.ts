import { useState, useEffect } from 'react';
import { skinAdminService } from '../service/skin_result';

export function useAdminSkinHistory() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    setLoading(true);
    const data = await skinAdminService.getAllSkinResults();
    setResults(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return { results, loading, refresh: fetchLogs };
}