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

export interface IPlan {
  id: number;
  name: string;
  price: number;
  billing: "monthly" | "annual";
  orders_limit: number;
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

export interface ICustomer {
  id?: string;
  id_tenant: string;
  full_name: string;
  total_orders: number;
  total_free_orders: number;
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
