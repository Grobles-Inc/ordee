import { ICustomer, IMeal, ITenant, IUser } from "@/interfaces";

export interface ITable {
  id?: string;
  status: boolean;
  number: number;
  id_tenant?: string;
}

export interface IOrder {
  id?: string;
  id_table: string;
  date?: Date;
  users?: IUser;
  customers?: ICustomer;
  tenants?: ITenant;
  id_tenant: string;
  id_customer?: string | null;
  id_user: string;
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
  getOrderForUpdate: (id: string) => Promise<IOrder>;
  getUnservedOrders: () => Promise<IOrder[]>;
  updatingOrder: IOrder | null;
  getOrdersCountByMonth: () => Promise<number | null>;
  updatePaidStatus: (id: string, paid: boolean) => Promise<void>;
  getPaidOrders: () => Promise<IOrder[]>;
  addTable: (table: ITable) => Promise<void>;
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
