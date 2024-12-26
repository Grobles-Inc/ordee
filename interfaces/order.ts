import { ICustomer, IMeal, ITenant, IUser } from "@/interfaces";

export interface IOrder {
  id?: string;
  id_table: string;
  date?: Date;
  users?: IUser;
  customers?: ICustomer;
  tenants?: ITenant;
  id_tenant: string;
  id_fixed_customer?: string | null;
  id_waiter: string;
  free?: boolean;
  served: boolean;
  to_go: boolean;
  paid: boolean;
  items: IMeal[];
  total: number;
}

export interface IOrderContextProvider {
  addOrder: (order: IOrder) => Promise<void>;
  updateOrderServedStatus: (id: string) => Promise<void>;
  getUnservedOrders: () => Promise<IOrder[]>;
  updatePaidStatus: (id: string, paid: boolean) => Promise<void>;
  getPaidOrders: () => Promise<IOrder[]>;
  loading: boolean;
  updateOrder: (order: IOrder) => Promise<void>;
  getOrderById: (id: string) => Promise<IOrder>;
  orders: IOrder[];
  order: IOrder;
  paidOrders: IOrder[];
  deleteOrder: (id: string) => Promise<void>;
  getOrders: () => Promise<IOrder[]>;
  getDailyPaidOrders: () => Promise<IOrder[]>;
  getUnpaidOrders: () => Promise<IOrder[]>;
}
