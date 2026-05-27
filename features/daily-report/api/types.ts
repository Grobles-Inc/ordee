export interface DailyStats {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  servedOrders: number;
  pendingOrders: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
  revenue: number;
}
