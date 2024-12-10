// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import type { DefaultSession, DefaultUser } from "next-auth";
import type * as jwt from "next-auth/jwt";
import { type UserType } from "./db/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType: UserType;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userType: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends jwt.DefaultJWT {
    id: string;
    userType: UserType;
  }
}
