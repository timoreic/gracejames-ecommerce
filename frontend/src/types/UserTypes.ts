export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  is_staff: boolean;
}

export interface UserInfoType {
  user: UserType;
  access_token: string;
  refresh_token: string;
}

export interface DeleteUserArgs {
  token: string;
  id: number;
}

export interface UserLoginArgs {
  email: string;
  password: string;
}

export interface UserUpdateArgs {
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  token: string;
}

export interface UserRegisterArgs {
  email: string;
  first_name?: string;
  last_name?: string;
  password1: string;
  password2: string;
}
