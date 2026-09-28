import api from './api';

export const dashboardService = {
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  async getConditionAnalytics() {
    const res = await api.get('/analytics/conditions');
    return res.data;
  },

  async getLifecycleAnalytics() {
    const res = await api.get('/analytics/lifecycle');
    return res.data;
  }
};

export default dashboardService;
