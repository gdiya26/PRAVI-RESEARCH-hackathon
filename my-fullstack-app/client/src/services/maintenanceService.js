import api from './api';

export const maintenanceService = {
  async getMaintenanceRecords(params = {}) {
    const res = await api.get('/maintenance', { params });
    return res.data || [];
  },

  async getAssetMaintenance(assetId) {
    const res = await api.get(`/assets/${assetId}/maintenance`);
    return res.data || [];
  },

  async createMaintenanceRecord(payload) {
    const res = await api.post('/maintenance', payload);
    return res.data;
  },

  async createAssetMaintenance(assetId, payload) {
    const res = await api.post(`/assets/${assetId}/maintenance`, payload);
    return res.data;
  },

  async updateMaintenanceStatus(id, status) {
    const res = await api.patch(`/maintenance/${id}/status`, { status });
    return res.data;
  }
};

export default maintenanceService;
