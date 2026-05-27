export interface GuestOrderItem {
  mealId: string;
  mealName: string;
  mealPrice: number;
  quantity: number;
}

export interface GuestOrderData {
  tableId: string;
  items: GuestOrderItem[];
  toGo: boolean;
}
