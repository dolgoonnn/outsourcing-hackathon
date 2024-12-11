import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { UserType } from "@/lib/db/enums";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      userType: UserType;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  // adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        // try {
        //   console.log("🚀 ~ file: auth.ts:24 ~ credentials:", credentials);
        //   const { email, password } = await loginSchema.parseAsync(credentials);
        //   console.log("🚀 ~ file: auth.ts:24 ~ email:", email);

        //   // const result = await prisma.user.findFirst({
        //   //   where: { email },
        //   // });
        //   const result = await db
        //     .selectFrom("User")
        //     .where("email", "=", email)
        //     .selectAll()
        //     .executeTakeFirst();
        //   console.log("🚀 ~ file: auth.ts:33 ~ result:", result);

        //   if (!result || !result.password) return null;

        //   const isValidPassword = await verify(result.password, password);

        //   if (!isValidPassword) return null;

        //   return {
        //     id: result.id,
        //     email,
        //     userType: result.type,
        //     role: result.role,
        //   };
        // } catch {
        //   return null;
        // }
        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
