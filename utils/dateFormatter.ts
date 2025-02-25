import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IOrder } from "../interfaces";

export function formatOrderDate(fecha: Date): string {
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    return format(fecha, "dd/MM/yyyy", { locale: es });
  } else {
    console.error("Fecha inválida:", fecha);
    return "";
  }
}

export const groupOrdersByDate = (orders: IOrder[]) => {
  return orders.reduce((groups: { [key: string]: IOrder[] }, order) => {
    if (!order.date) return groups;
    const date = new Date(order.date);
    const dateLabel = format(date, "dd 'de' MMMM", { locale: es });

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(order);
    return groups;
  }, {});
};
