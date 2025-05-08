import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePasswords, hashPassword } from "./password_utils";
import db from "@/lib/db";
import { PrismaAdapter } from "./PrismaAdapter";
import Google from "next-auth/providers/google";
import { AuthConfig } from "./base";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...AuthConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          passwordHash: await hashPassword("12345678")
        }
      }
    }),
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
        const user = await db.user.findFirst({
          where: {
            email: credentials.email
          },
          include: {
            teamMemberships: true,
          },
        })
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
        
        const teamMembership = user.teamMemberships.find(
          (tm) => tm.teamId === credentials.teamId
        );
        
        if (hasTeam && !teamMembership) {
          throw new Error("User is not a member of the specified team.");
        }
        
        if (hasTeam) {
          // If hasTeam is true, teamMembership must be valid, and teamMembership.teamId is a string.
          return {
            ...user, // Prisma user object
            teamId: teamMembership!.teamId // Definitely a string
          };
        } else {
          // If not targeting a specific team, teamId can be the first one found or null.
          return {
            ...user, // Prisma user object
            teamId: user.teamMemberships[0]?.teamId ?? null // string | null
          };
        }
      },
    }),
  ],
});
