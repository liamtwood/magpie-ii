const API_BASE = '/api';

export const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`GET ${endpoint} failed`);
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed`);
    return response.json();
  },

  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PATCH ${endpoint} failed`);
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);
    return response.ok;
  },
};

export const issuesApi = {
  getAll: () => api.get('/issues'),
  getOne: (id) => api.get(`/issues/${id}`),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.patch(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
  getAssignments: (id) => api.get(`/issues/${id}/assignments`),
};

export const objectsApi = {
  getAll: () => api.get('/objects'),
  getOne: (id) => api.get(`/objects/${id}`),
  update: (id, data) => api.patch(`/objects/${id}`, data),
  getIssues: (id) => api.get(`/objects/${id}/issues`),
};

export const targetsApi = {
  getAll: () => api.get('/delivery-targets'),
};

export default api;
