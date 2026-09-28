import api from './api';

export const executiveService = {
  async getSummary() {
    const res = await api.get('/executive/summary');
    return res.data;
  },

  async getProjects(params = {}) {
    const res = await api.get('/executive/projects', { params });
    return res.data || [];
  },

  async getAttentionProjects() {
    const res = await api.get('/executive/attention');
    return res.data || [];
  }
};

export default executiveService;
