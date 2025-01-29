import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePasswords, hashPassword } from "./password_utils";
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
          throw new Error("Email and password are required.");
        }
        if (typeof credentials.password !== "string" || typeof credentials.email !== "string") {
          throw new Error("Email and password must be strings.");
        }
        const hasTeam = !!credentials.teamId && typeof credentials.teamId === "string";
        let user = await db.user.findFirst({
          where: {
            email: credentials.email
          },
          include: {
            teamMembers: true,
          },
        })
        // 校验密码
        
        if (!user) {
          throw new Error("User not found or incorrect password.");
        }
        const isPasswordValid = await comparePasswords(
          credentials.password,
          user.passwordHash
        );
        
        if (!isPasswordValid) {
          throw new Error("User not found or incorrect password1.");
        }
        
        const teamId = user.teamMembers.find(
          (z) => z.teamId === credentials.teamId
        );
        
        if (hasTeam && !teamId) {
          throw new Error("User is not a member of the specified team.");
        }
        
        return {
          ...user,
          teamId,
        };
      },
    }),
  ],
});
