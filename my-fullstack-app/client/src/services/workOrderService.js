import api from './api';

export const workOrderService = {
  async getWorkOrders(params = {}) {
    const res = await api.get('/work-orders', { params });
    return res.data || [];
  },

  async getAssetWorkOrders(assetId) {
    const res = await api.get(`/assets/${assetId}/work-orders`);
    return res.data || [];
  },

  async createWorkOrder(payload) {
    const res = await api.post('/work-orders', payload);
    return res.data;
  },

  async createAssetWorkOrder(assetId, payload) {
    const res = await api.post(`/assets/${assetId}/work-orders`, payload);
    return res.data;
  },

  async updateWorkOrderStatus(id, status) {
    const res = await api.patch(`/work-orders/${id}/status`, { status });
    return res.data;
  }
};

export default workOrderService;
