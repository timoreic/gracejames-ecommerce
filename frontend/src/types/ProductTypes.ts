export interface ProductProps {
  product: ProductType;
}

export interface ProductType {
  _id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  baseprice: number;
  surcharge?: number;
  totalprice?: number;
  size?: string;
  material?: string;
}

export interface DeleteProductArgs {
  token: string;
  id: number;
}

export interface UpdateProductArgs {
  token: string;
  product: ProductType;
}
