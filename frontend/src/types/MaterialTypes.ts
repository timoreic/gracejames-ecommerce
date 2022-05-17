export interface MaterialType {
  _id: number;
  material: string;
  surcharge: number;
  category: string;
}

export interface DeleteMaterialArgs {
  token: string;
  id: number;
}

export interface UpdateMaterialArgs {
  token: string;
  material: MaterialType;
}
