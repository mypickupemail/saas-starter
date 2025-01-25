import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "./config";
import db from "../db";
import { TeamDataWithMembers } from "../db/schema";
import { User } from "@prisma/client";

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message } as T;
    }
    return action(result.data, formData);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: User &{
    teamId: string|undefined
  }
) => Promise<T>;

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message } as T;
    }
    const dbuser = await db.user.findUnique({
      where:{
        id:user.id
      }
    })
    if(!dbuser){
      throw new Error("User is not authenticated")
    }
    return action(result.data, formData, {
      ...dbuser , 
      teamId: user.teamId!
    });
  };
}

type ActionWithTeamFunction<T> = (
  formData: FormData,
  team: TeamDataWithMembers
) => Promise<T>;

export function withTeam<T>(action: ActionWithTeamFunction<T>) {
  return async (formData: FormData): Promise<T> => {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
      redirect("/sign-in");
    }
    if (!user?.teamId) {
      throw new Error("User is not part of a team");
    }
    const team = await db.team.findUnique({
      where: { id: user.teamId },
      include: {
        members: {
          include:{
            user:true
          }
        }
      },
    });
    if (!team) {
      throw new Error("Team not found");
    }

    return action(formData, team);
  };
}
