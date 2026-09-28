import api from './api';

export const inspectionService = {
  async getInspections(params = {}) {
    const res = await api.get('/inspections', { params });
    return res.data || [];
  },

  async getAssetInspections(assetId) {
    const res = await api.get(`/assets/${assetId}/inspections`);
    return res.data || [];
  },

  async createInspection(payload) {
    const res = await api.post('/inspections', payload);
    return res.data;
  },

  async createAssetInspection(assetId, payload) {
    const res = await api.post(`/assets/${assetId}/inspections`, payload);
    return res.data;
  }
};

export default inspectionService;
