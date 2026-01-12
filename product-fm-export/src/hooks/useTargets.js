import { useState, useEffect, useCallback } from 'react';
import { targetsApi } from '../services/api';

export const useTargets = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTargets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await targetsApi.getAll();
      setTargets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const pages = targets.filter(t => t.type === 'page');
  const widgets = targets.filter(t => t.type === 'widget');

  return {
    targets,
    pages,
    widgets,
    loading,
    error,
    refetch: fetchTargets,
  };
};

export default useTargets;
