import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import db from "@/lib/db";
import { Role } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      teamId: string|null;
      role: string;
      activeTeamRole?: Role | null;
    } & DefaultSession["user"];
  }
} 

export const AuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          teamId: token.teamId as string | null,
          role: token.role as string,
          activeTeamRole: token.activeTeamRole as Role | null,
        },
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role;
        token.teamId = (user as any).teamId;

        if ((user as any).teamId) {
          const teamMember = await db.teamMember.findFirst({
            where: {
              userId: user.id,
              teamId: (user as any).teamId,
            },
          });
          token.activeTeamRole = teamMember?.role ?? null;
        } else {
          token.activeTeamRole = null;
        }
      }
      return token;
    }
  },
} satisfies NextAuthConfig;
export const { auth } = NextAuth(AuthConfig);
 