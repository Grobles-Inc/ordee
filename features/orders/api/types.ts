import type { Order, NewOrder } from "~/server/db/schema/orders";
import type { OrderMeal, NewOrderMeal } from "~/server/db/schema/order-meals";

export type { Order, NewOrder, OrderMeal, NewOrderMeal };

export interface OrderWithDetails extends Order {
  tables?: {
    id: string;
    number: number;
  } | null;
  users?: {
    id: string;
    name: string;
    lastName: string;
  } | null;
  orderMeals?: OrderMealWithMeal[];
}

export interface OrderMealWithMeal extends OrderMeal {
  meals?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  } | null;
}

export interface OrderItem {
  mealId: string;
  mealName: string;
  mealPrice: number;
  quantity: number;
}

export interface CreateOrderData {
  idTable: string;
  items: OrderItem[];
  toGo: boolean;
}
