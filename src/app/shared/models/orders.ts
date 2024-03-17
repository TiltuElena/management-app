export interface OrdersInterface{
  id?: number;
  orderDate?: Date | string;
  products?: any;
  quantity?: number;
  total_price?: number;
  customerId?: number;
}
