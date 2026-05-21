import type { RoleEnum } from "../../enums";

export type EmailType = string;
export type PasswordType = string;
export type NameType = string;
export type RoleType = RoleEnum | RoleEnum[];
// export type RoleType = "admin" | "user" | ("admin" | "user")[];
export type DataType = Record<string, any>;
export type IdType = string;
