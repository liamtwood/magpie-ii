import { useState, useEffect, useCallback } from 'react';
import { issuesApi } from '../services/api';

export const useIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await issuesApi.getAll();
      setIssues(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const createIssue = async (issueData) => {
    const newIssue = await issuesApi.create(issueData);
    setIssues(prev => [...prev, newIssue]);
    return newIssue;
  };

  const updateIssue = async (id, updates) => {
    const updated = await issuesApi.update(id, updates);
    setIssues(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };

  const deleteIssue = async (id) => {
    await issuesApi.delete(id);
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  const epics = issues.filter(i => i.type === 'Epic');
  const stories = issues.filter(i => i.type === 'Story');

  return {
    issues,
    epics,
    stories,
    loading,
    error,
    refetch: fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
  };
};

export default useIssues;
