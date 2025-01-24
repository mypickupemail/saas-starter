import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { hashPassword } from "./password_utils";
import db from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { AuthConfig } from "./base";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...AuthConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
        teamId: {},
      },
      authorize: async (credentials) => {
        if (!credentials.password || !credentials.email) {
          throw new Error("Invalid credentials.");
        }
        if (typeof credentials.password !== "string") {
          throw new Error("Invalid credentials.");
        }
        if (typeof credentials.email !== "string") {
          throw new Error("Invalid credentials.");
        }
        // logic to salt and hash password
        const pwHash = await hashPassword(credentials.password);
        const hasTeam =
          !!credentials.teamId && typeof credentials.teamId === "string";
        // logic to verify if the user exists
        let user = await db.user.findFirst({
          where: {
            email: credentials.email,
            passwordHash: pwHash,
          },
          include: {
            teamMembers: true,
          },
        });
        if (!user) {
          throw new Error("Invalid credentials.");
        }
        const teamId = user.teamMembers.find(
          (z) => z.teamId === credentials.teamId
        );
        if (hasTeam && teamId) {
          throw new Error("Invalid credentials.");
        }
        return {
          ...user,
          teamId,
        };
      },
    }),
  ],
});
