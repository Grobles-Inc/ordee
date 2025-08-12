import { Session } from "@supabase/supabase-js";

export interface ITenant {
  id: string;
  name: string;
  id_admin: string;
  id_plan: string;
  logo: string;
  plans?: IPlan;
  created_at: string;
  queries: number;
}

export interface IUser {
  id: string;
  name: string;
  email?: string;
  password?: string;
  id_tenant?: string;
  tenants?: ITenant;
  last_name: string;
  image_url: string;
  role: "user" | "guest" | "admin";
}

export interface IAuthContextProvider {
  profile: IUser;
  session: Session | null;
  getProfile: (id: string) => void;
  updateProfile: (user: IUser) => void;
  loading: boolean;
  signOut: () => void;
  deleteUser: (id: string) => void;
  getUsers: () => void;
  users: IUser[];
}


export interface ICategory {
  id?: string;
  name: string;
  description: string;
  id_tenant?: string;
}


export interface ICategoryContextProvider {
  addCategory: (category: ICategory, tenantId?: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<ICategory>;
  getCategories: (tenantId?: string) => Promise<ICategory[] | any[] | undefined>;
  categories: ICategory[];
  category: ICategory;
  loading: boolean;
  deleteCategory: (id: string, tenantId?: string) => Promise<void>;
}
export interface IMeal {
  id: string;
  name: string;
  price: number;
  categories?: ICategory;
  image_url: string;
  id_category: string;
  quantity: number | string;
  stock: boolean;
}

export interface IMealContextProvider {
  addMeal: (Meal: IMeal, tenantId?: string) => Promise<void>;
  getMealById: (id: string) => Promise<IMeal>;
  getMealsByCategoryId: (id: string, tenantId?: string) => Promise<IMeal[]>;
  updateMeal: (meal: IMeal) => Promise<void>;
  loading: boolean;
  changeMealAvailability: (id: string, quantity: number) => Promise<void>;
  meals: IMeal[];
  deleteMeal: (id: string, cloudinaryPublicId: string) => Promise<void>;
  getDailyMeals: (tenantId?: string) => Promise<null | IMeal[]>;
  subscribeToMeals: (tenantId?: string) => () => void;
}

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
  tenants?: ITenant;
  id_tenant: string;
  tables?: ITable;
  id_user: string;
  served: boolean;
  to_go: boolean;
  paid: boolean;
  order_meals: IMeal[];
  items: IMeal[];
  total: number;
}
export interface IPlan {
  id: number;
  name: string;
  price: number;
  billing: "monthly" | "annual";
  orders_limit: number;
}

export interface IOrderContextProvider {
  addOrder: (order: IOrder, tenantId?: string) => Promise<void>;
  updateOrderServedStatus: (id: string) => Promise<void>;
  unpaidOrders: IOrder[];
  getOrdersCountByDay: (tenantId?: string) => Promise<number | null>;
  getUnservedOrders: (tenantId?: string) => Promise<IOrder[]>;
  setUpdatingOrder: (order: IOrder | null) => void;
  updatingOrder: IOrder | null;
  getOrdersCountByMonth: (tenantId?: string) => Promise<number | null>;
  updatePaidStatus: (id: string, paid: boolean) => Promise<void>;
  getPaidOrders: (tenantId?: string) => Promise<IOrder[]>;
  addTable: (table: ITable, tenantId?: string) => Promise<void>;
  loading: boolean;
  updateOrder: (order: IOrder) => Promise<void>;
  getOrderById: (id: string) => Promise<IOrder>;
  order: IOrder;
  paidOrders: IOrder[];
  deleteOrder: (orderId: string, tableId: string, itemsToRestore: { meal_id: string; quantity: number }[]) => Promise<void>;
  getDailyPaidOrders: (tenantId?: string) => Promise<IOrder[]>;
  getUnpaidOrders: (tenantId?: string) => Promise<IOrder[]>;
  subscribeToOrders: (tenantId?: string) => () => void;
}

export interface ITablesContextProvider {
  addTable: (table: ITable, tenantId?: string) => Promise<void>;
  getTables: (tenantId?: string) => Promise<ITable[] | null>;
  tables: ITable[];
  loading: boolean;
  updateTableStatus: (id: string, status: boolean) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  subscribeToTables: (tenantId?: string) => () => void;
}

export interface IAccount {
  id?: string;
  id_tenant?: string;
  name: string;
  role: "user" | "guest" | "admin";
  last_name: string;
  image_url: string;
  disabled: boolean;
}

export interface IAccountState {  
  accounts: IAccount[];
  loading: boolean;
  setAccounts: (accounts: IAccount[]) => void;
  setLoading: (loading: boolean) => void;
  getEnabledAccounts: (tenantId?: string) => Promise<IAccount[] | null>;
  addAccount: (account: IAccount, tenantId?: string) => Promise<void>;
  updateAccount: (id: string, updates: Partial<IAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  subscribeToAccounts: (tenantId?: string) => () => void;
}