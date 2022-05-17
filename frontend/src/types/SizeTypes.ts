export interface SizeType {
  _id: number;
  size: string;
  surcharge: number;
  category: string;
}

export interface DeleteSizeArgs {
  token: string;
  id: number;
}

export interface UpdateSizeArgs {
  token: string;
  size: SizeType;
}
