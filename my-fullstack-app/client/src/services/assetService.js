import api from './api';

export const assetService = {
  async getAssets(params = {}) {
    const res = await api.get('/assets', { params });
    return res.data || [];
  },

  async getAssetById(id) {
    const res = await api.get(`/assets/${id}`);
    return res.data;
  },

  async createAsset(assetData) {
    const res = await api.post('/assets', assetData);
    return res.data;
  },

  async updateAsset(id, assetData) {
    const res = await api.put(`/assets/${id}`, assetData);
    return res.data;
  },

  async deleteAsset(id) {
    const res = await api.delete(`/assets/${id}`);
    return res.data;
  },

  async getAssetPassport(id) {
    const res = await api.get(`/assets/${id}/passport`);
    return res.data;
  },

  async getAssetLifecycle(id) {
    const res = await api.get(`/assets/${id}/lifecycle`);
    return res.data;
  },

  async advanceAssetLifecycle(id, payload) {
    const res = await api.post(`/assets/${id}/lifecycle`, payload);
    return res.data;
  },

  async getTrafficAssets() {
    const res = await api.get('/traffic-assets');
    return res.data || [];
  }
};

export default assetService;
