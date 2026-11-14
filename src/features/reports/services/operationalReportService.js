import axiosClient from '@/shared/services/http/axiosClient';
import { queryString } from '../utils/reportUtils';
const root = '/admin/reports/operations';
export default {
  get: (filter, signal) => axiosClient.get(`${root}?${queryString(filter)}`, { signal }),
  filters: () => axiosClient.get(`${root}/filters`),
  saveNote: (date, note, version) => axiosClient.put(`${root}/notes/${date}`, { note, version }),
  support: (status, page) => axiosClient.get(`${root}/support?status=${status}&page=${page}`),
  review: (id, status, expectedStatus, note) => axiosClient.put(`${root}/support/${id}`, { status, expectedStatus, note }),
  export: (filter) => axiosClient.get(`${root}/export?${queryString(filter)}`, { responseType: 'blob', timeout: 60000 }),
};
