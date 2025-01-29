import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      teamId: string|null;
      role: "owner" | "member" | string
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
          id:token.sub,
          teamId:token.teamId,
          role: token.role
        },
      }
    },
    jwt({ token, user }) {
      if(user){
        return {
          ...token,
          teamId: ('teamId' in user && typeof user.teamId==='string')? user.teamId : null ,
          role: ('role' in user && typeof user.role==='string')? user.role : null 
        }

      }
      return token
    }
  },
} satisfies NextAuthConfig;
export const { auth } = NextAuth(AuthConfig);
 