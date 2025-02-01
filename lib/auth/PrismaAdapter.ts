import { PrismaAdapter as BasePrismaAdapter } from "@auth/prisma-adapter";
import db from "../db";
import { logActivity } from "../db/queries";
import { ActivityType } from "../db/schema";

type PrismaAdapterArg = Parameters<typeof BasePrismaAdapter>[0];
type PrismaAdapterReturn = ReturnType<typeof BasePrismaAdapter>;

/**
 * config user role
 * @param arg
 * @returns
 */
export function PrismaAdapter(arg: PrismaAdapterArg) {
  const { createUser: _createUser, ...adapter } = BasePrismaAdapter(arg);
  const createUser: PrismaAdapterReturn["createUser"] = _createUser
    ? async (user) => {
        // @ts-expect-error adapter role
        user.role = "owner";
        const createdUser = await _createUser(user);
        const email = createdUser.email;
        const newTeam = {
          name: `${email}'s Team`,
        };
        const team = await db.team.create({
          data: {
            name: newTeam.name,
          },
        });
        await db.teamMember.create({
          data: {
            userId: createdUser.id,
            teamId: team.id,
            role: "owner",
          },
        });
        await logActivity(team.id, createdUser.id, ActivityType.SIGN_UP);

        return createdUser;
      }
    : undefined;

  return {
    createUser,
    ...adapter,
  };
}
