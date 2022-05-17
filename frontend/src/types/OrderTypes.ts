import type { CartItemType } from './CartTypes';
import type { ShippingAddressType } from './ShippingAddressTypes';
import type { UserType } from './UserTypes';

export interface OrderType {
  _id: number;
  orderItems: CartItemType[];
  shippingAddress: ShippingAddressType;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  token: string;
  user?: UserType;
  isPaid?: Boolean;
  paidAt?: string;
  isDelivered?: Boolean;
  deliveredAt?: string;
  createdAt?: string;
}

export interface CreateOrderArgs {
  orderItems: CartItemType[];
  shippingAddress: ShippingAddressType;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  token: string;
}

export interface FetchOrderDetailsArgs {
  id: number;
  token: string;
}

export interface PayOrderArgs {
  id: number;
  paymentResult: string;
  token: string;
}

export interface DeliverOrderArgs {
  order: OrderType;
  token: string;
}
