import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "./supabase";
type DayTotals = {
  [key in
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"]: number;
};
type MonthlyTotals = {
  [key: string]: number;
};


const calculateOrderTotal = (order: IOrder): number => {
  const getMealsTotal = (meals: IMeal[]) =>
    meals.reduce(
      (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
      0
    );
  return getMealsTotal(order.items);
};

export const monthlyTotalsSales = async (date: Date, id_tenant: string) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const { data: monthOrders, error } = await supabase
    .from("orders")
    .select("*")
    .gte("date", startOfMonth.toISOString())
    .lte("date", endOfMonth.toISOString())
    .eq("paid", true)
    .eq("id_tenant", id_tenant);

  if (error) throw error;

  const totals: MonthlyTotals = {};
  let monthTotal = 0;

  monthOrders?.forEach((order: IOrder) => {
    if (order.date) {
      const date = new Date(order.date).toISOString().split("T")[0];
      totals[date] = (totals[date] || 0) + calculateOrderTotal(order);
      monthTotal += calculateOrderTotal(order);
    }
  });
  return monthTotal;
};
