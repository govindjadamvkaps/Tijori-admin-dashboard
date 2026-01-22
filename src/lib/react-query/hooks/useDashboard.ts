// lib/react-query/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/api/dashboard.service';
import { DashboardApiResponse } from '@/interfaces/dashboard.interface';

export const DASHBOARD_QUERY_KEYS = {
  counts: ['dashboard', 'counts'] as const,
};

export const useDashboardCounts = () => {
  return useQuery<DashboardApiResponse>({
    queryKey: DASHBOARD_QUERY_KEYS.counts,
    queryFn: dashboardService.getCounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};