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
  const { createUser: _createUser,getUserByAccount: _getUserByAccount, ...adapter } = BasePrismaAdapter(arg);
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
        // @ts-expect-error adapter role
        createdUser.teamId = team.id;
        return createdUser;
      }
    : undefined;
    
  const getUserByAccount: PrismaAdapterReturn["getUserByAccount"] = _getUserByAccount
    ? async (providerAccountId) => {
        const user =  await _getUserByAccount(providerAccountId)
        if(!user) return null
        const team = await db.teamMember.findFirst({
          where:{
            userId:user.id
          }
        })
        // @ts-expect-error adapter teamId
        user.teamId = team?.teamId
        return user
  } : undefined
  return {
    createUser,
    getUserByAccount,
    ...adapter,
  };
}
