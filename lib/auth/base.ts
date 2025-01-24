import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      teamId?: string;
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
          teamId:token.teamId
        },
      }
    },
    jwt({ token, user }) {
      return {
        ...token,
        teamId: ('teamId' in user && typeof user.teamId==='string')? user.teamId : null 
      }
    }
  },
} satisfies NextAuthConfig;
export const { auth } = NextAuth(AuthConfig);
