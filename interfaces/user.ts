import { Session } from "@supabase/supabase-js";
export interface IUser {
  id?: string;
  name?: string;
  id_tenant?: string;
  last_name?: string;
  image_url?: string;
  role: "waiter" | "chef" | "admin";
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
  loading: boolean;
  signOut: () => void;
  updateProfile: (userData: Partial<IUser>) => void;
  deleteUser: (id: string) => void;
  getUsers: (id_tenant: string) => void;
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
