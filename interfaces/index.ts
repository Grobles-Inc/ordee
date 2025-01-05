import { Session } from "@supabase/supabase-js";

export interface ITenant {
  id: string;
  name: string;
  id_admin: string;
  id_plan: string;
  logo: string;
  created_at: Date;
  plans?: IPlan;
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
export interface ICustomerContextProvider {
  loading: boolean;
  deleteCustomer: (id: string) => void;
  addCustomer: (customer: ICustomer) => void;
  getCustomerById: (id: string) => void;
  getCustomers: () => void;
  customers: ICustomer[];
  customer: ICustomer;
}

export interface ICategory {
  id?: string;
  name: string;
  description: string;
  created_at?: Date;
  id_tenant?: string;
}
export interface ICustomer {
  id?: string;
  id_tenant: string;
  full_name: string;
  total_orders: number;
  total_free_orders: number;
}

export interface ICategoryContextProvider {
  addCategory: (category: ICategory) => Promise<void>;
  getCategoryById: (id: string) => Promise<ICategory>;
  getCategories: () => Promise<ICategory[] | any[] | undefined>;
  categories: ICategory[];
  category: ICategory;
  loading: boolean;
  deleteCategory: (id: string) => Promise<void>;
}
export interface IMeal {
  id: string;
  name: string;
  price: number;
  categories?: ICategory;
  created_at?: Date;
  image_url: string;
  id_category: string;
  quantity: number;
}

export interface IMealContextProvider {
  addMeal: (Meal: IMeal) => Promise<void>;
  getMealById: (id: string) => Promise<IMeal>;
  getMealsByCategoryId: (id: string) => Promise<IMeal[]>;
  updateMeal: (meal: IMeal) => Promise<void>;
  loading: boolean;
  changeMealAvailability: (id: string, quantity: number) => Promise<void>;
  meals: IMeal[];
  deleteMeal: (id: string) => Promise<void>;
  getDailyMeals: () => Promise<null | IMeal[]>;
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
  customers?: ICustomer;
  tenants?: ITenant;
  id_tenant: string;
  tables?: ITable;
  id_customer?: string | null;
  id_user: string;
  free?: boolean;
  served: boolean;
  to_go: boolean;
  paid: boolean;
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
  addOrder: (order: IOrder) => Promise<void>;
  updateOrderServedStatus: (id: string) => Promise<void>;
  unpaidOrders: IOrder[];
  getOrdersCountByDay: () => Promise<number | null>;
  getOrderForUpdate: (id: string) => Promise<IOrder>;
  getUnservedOrders: () => Promise<IOrder[]>;
  setUpdatingOrder: (order: IOrder | null) => void;
  updatingOrder: IOrder | null;
  getOrdersCountByMonth: () => Promise<number | null>;
  updatePaidStatus: (id: string, paid: boolean) => Promise<void>;
  getPaidOrders: () => Promise<IOrder[]>;
  addTable: (table: ITable) => Promise<void>;
  loading: boolean;
  updateOrder: (order: IOrder) => Promise<void>;
  getOrderById: (id: string) => Promise<IOrder>;
  order: IOrder;
  paidOrders: IOrder[];
  deleteOrder: (id: string) => Promise<void>;

  getDailyPaidOrders: () => Promise<IOrder[]>;
  getUnpaidOrders: () => Promise<IOrder[]>;
}
