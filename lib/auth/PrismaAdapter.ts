import { PrismaAdapter as BasePrismaAdapter } from "@auth/prisma-adapter";
import db from "../db";

type PrismaAdapterArg = Parameters<typeof BasePrismaAdapter>[0]
type PrismaAdapterReturn = ReturnType<typeof BasePrismaAdapter>


/**
 * config user role 
 * @param arg 
 * @returns 
 */
export function PrismaAdapter(arg: PrismaAdapterArg) {
    const { createUser: _createUser, ...adapter } = BasePrismaAdapter(arg)
    const createUser: PrismaAdapterReturn['createUser'] = _createUser ? async (user) => {
        // @ts-expect-error adapter role 
        user.role = 'owner'
        const createUser = await _createUser(user)
        const email = createUser.email
        const newTeam = {
            name: `${email}'s Team`,
        };
        await db.team.create({
            data: {
                name: newTeam.name
            }
        })
        return createUser
    } : undefined

    return {
        createUser,
        ...adapter
    }
}