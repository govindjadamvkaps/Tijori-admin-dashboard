
// lib/api/dashboard.service.ts
import { apiRequest } from '../axiosInstance';
import { DashboardApiResponse } from '@/interfaces/dashboard.interface';

export const dashboardService = {
  getCounts: async (): Promise<DashboardApiResponse> => {
    return apiRequest<DashboardApiResponse>({
      method: 'get',
      url: '/dashboard/counts',
    });
  },
};