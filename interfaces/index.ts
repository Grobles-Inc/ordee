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
  image_url: string;
  id_category: string;
  quantity: number | string;
  stock: boolean;
}

export interface IMealContextProvider {
  addMeal: (Meal: IMeal) => Promise<void>;
  getMealById: (id: string) => Promise<IMeal>;
  getMealsByCategoryId: (id: string) => Promise<IMeal[]>;
  updateMeal: (meal: IMeal) => Promise<void>;
  loading: boolean;
  changeMealAvailability: (id: string, quantity: number) => Promise<void>;
  meals: IMeal[];
  deleteMeal: (id: string, cloudinaryPublicId: string) => Promise<void>;
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
  tenants?: ITenant;
  id_tenant: string;
  tables?: ITable;
  id_user: string;
  served: boolean;
  to_go: boolean;
  paid: boolean;
  order_meals: IMeal[];
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
  deleteOrder: (orderId: string, tableId: string, itemsToRestore: { meal_id: string; quantity: number }[]) => Promise<void>;

  getDailyPaidOrders: () => Promise<IOrder[]>;
  getUnpaidOrders: () => Promise<IOrder[]>;
}
