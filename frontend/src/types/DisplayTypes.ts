export interface DisplayType {
  _id: number;
  name: string;
  image: string;
}

export interface DeleteDisplayArgs {
  token: string;
  id: number;
}

export interface UpdateDisplayArgs {
  token: string;
  display: DisplayType;
}
