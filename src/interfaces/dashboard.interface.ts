// interfaces/dashboard.interface.ts
export interface DashboardCounts {
  users: {
    total: number;
    active: number;
    deleted: number;
  };
  buckets: {
    total: number;
    active: number;
    deleted: number;
  };
  categories: {
    total: number;
    system: number;
    custom: number;
  };
}

export interface DashboardApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardCounts;
}
