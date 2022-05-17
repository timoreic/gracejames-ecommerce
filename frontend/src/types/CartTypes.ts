export interface AddToCartArgs {
  productId: number;
  qty: number;
  sizeSurcharge: number;
  materialSurcharge: number;
}

export interface CartItemType {
  product: number;
  name: string;
  qty: number;
  basePrice: number;
  sizeSurcharge: number;
  materialSurcharge: number;
  image: string;
}
