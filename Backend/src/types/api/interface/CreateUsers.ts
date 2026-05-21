import type {
  DataType,
  EmailType,
  IdType,
  NameType,
  PasswordType,
  RoleType,
} from "../types";

export interface CreateUsersInterface {
  email: EmailType;
  password: PasswordType;
  name: NameType;
  role?: RoleType;
  data?: DataType;
}
export interface GetUserIdInterface {
  id: IdType;
}
export interface SetUserRoleInterface {
  id: IdType;
  role: RoleType;
}
