// import { createAccessControl } from "better-auth/plugins/access";
// import {
//   adminAc,
//   defaultStatements,
// } from "better-auth/plugins/organization/access";
// import { RoleEnum } from "../types/enums";

// export const statement = {
//   ...defaultStatements,
//   project: ["create", "share", "update", "delete"],
//   user: ["ban"],
// } as const;

// export const ac = createAccessControl(statement);

// export const roles = {
//   [RoleEnum.PATIENT]: ac.newRole({
//     project: ["create"],
//   }),

//   [RoleEnum.DOCTOR]: ac.newRole({
//     project: ["create", "update", "delete"],
//     user: ["ban"],
//   }),

//   [RoleEnum.ADMIN]: ac.newRole({
//     ...adminAc.statements,
//     project: ["create", "update", "delete", "share"],
//   }),

//   [RoleEnum.NURSE]: ac.newRole({
//     project: ["create", "update"],
//   }),

//   [RoleEnum.LAB_TECH]: ac.newRole({
//     project: ["create"],
//   }),

//   [RoleEnum.PHARMACIST]: ac.newRole({
//     project: ["create"],
//   }),

//   [RoleEnum.ALL]: ac.newRole({
//     project: [],
//   }),
// };
