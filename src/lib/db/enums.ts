export const UserType = {
  USER_CLIENT: "USER_CLIENT",
  USER_PROVIDER: "USER_PROVIDER",
  USER_ADMIN: "USER_ADMIN",
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
