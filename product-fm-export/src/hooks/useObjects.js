import { useState, useEffect, useCallback } from 'react';
import { objectsApi } from '../services/api';

export const useObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await objectsApi.getAll();
      setObjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  const updateObject = async (id, updates) => {
    const updated = await objectsApi.update(id, updates);
    setObjects(prev => prev.map(o => o.id === id ? updated : o));
    return updated;
  };

  return {
    objects,
    loading,
    error,
    refetch: fetchObjects,
    updateObject,
  };
};

export default useObjects;
