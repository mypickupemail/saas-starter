'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/payments/stripe';
import {
  validatedAction,
  validatedActionWithUser,
} from '@/lib/auth/middleware';
import { ActivityType } from '@/lib/db/schema';
import db from '@/lib/db';
import {auth, 
  signOut as signOutService,
  signIn as signInService} from '@/lib/auth/config';
import { comparePasswords, hashPassword } from '@/lib/auth/password_utils';
import { Prisma, Team } from '@prisma/client';

async function logActivity(
  teamId: string | null | undefined,
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || '',
  };
  await db.activityLog.create({
    data: newActivity
  })
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data,formData) => {
  const { email, password } = data;
  try {
    await signInService("credentials",formData);
    redirect('/dashboard');
    
  } catch (error) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password,
    };
  }

});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  const existingUser = await db.user.count({
    where:{
      email
    }
  })

  if (existingUser > 0) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password,
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    email,
    passwordHash,
    role: 'owner', // Default role, will be overridden if there's an invitation
  };

  //TODO use react-resend to send verification email
  const createdUser = await db.user.create({
    data: newUser
  })

  if (!createdUser) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password,
    };
  }

  let teamId: string;
  let userRole: string;
  let createdTeam: Team| null = null;

  if (inviteId) {
    const invitation = await db.invitation.findUnique({
      where:{id:inviteId}
    })

    if (invitation) {
      teamId = invitation.teamId;
      userRole = invitation.role;
      await db.invitation.update({
        where:{id:inviteId} ,
        data:{
          status:"accepted"
        }
      })

      await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);
      createdTeam = await db.team.findUnique({
        where:{id:teamId}
      }) 
    } else {
      return { error: 'Invalid or expired invitation.', email, password };
    }
  } else {
    // Create a new team if there's no invitation
    const newTeam = {
      name: `${email}'s Team`,
    };

    createdTeam = await  db.team.create({
      data:{
        name:newTeam.name
      }
    })
    // db.insert(teams).values(newTeam).returning();

    if (!createdTeam) {
      return {
        error: 'Failed to create team. Please try again.',
        email,
        password,
      };
    }

    teamId = createdTeam.id;
    userRole = 'owner';

    await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  }

 

  await Promise.all([
    db.teamMember.create({
      data: {
        userId: createdUser.id,
        teamId: teamId,
        role: userRole,
      }
    }),
 //   db.insert(teamMembers).values(newTeamMember),
    logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
    //setSession(createdUser),
    signInService("credentials",{
      email,
      password,
      redirect:false
    })
  ]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect('/dashboard');
});

export async function signOut() {
  const session = await auth()
  const user = session?.user
  if(user?.id){ 
    await logActivity(user?.teamId, user.id, ActivityType.SIGN_OUT);
  }
  await signOutService()
}

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return { error: 'Current password is incorrect.' };
    }

    if (currentPassword === newPassword) {
      return {
        error: 'New password must be different from the current password.',
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
   
    await Promise.all([
      db.user.update({
        where:{id:user.id},
        data:{passwordHash:newPasswordHash}
      }), 
      logActivity(user.teamId, user.id, ActivityType.UPDATE_PASSWORD),
    ]);

    return { success: 'Password updated successfully.' };
  },
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: 'Incorrect password. Account deletion failed.' };
    }

    const teamId = user.teamId;
    await logActivity(
      teamId,
      user.id,
      ActivityType.DELETE_ACCOUNT,
    );
    // Soft delete
    await db.user.update({
      where:{id:user.id},
      data:{
         email: `${user.email}-${user.id}-deleted`, 
        deletedAt:new Date()
      }
    })

    if (user.teamId) {
      await db.teamMember.deleteMany({
        where: {
          userId: user.id,
          teamId: user.teamId
        }
      })
    }

    (await cookies()).delete('session');
    redirect('/sign-in');
  },
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data; 

    await Promise.all([
      db.user.update({
        where:{id:user.id},
        data:{
          name,
          email
        }
      }),
      logActivity(user.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { success: 'Account updated successfully.' };
  },
);

const removeTeamMemberSchema = z.object({
  memberId: z.string(),
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;

    if (!user?.teamId) {
      return { error: 'User is not part of a team' };
    }
    await db.teamMember.delete({
      where:{
        id:memberId,
        teamId:user.teamId
      }
    }) 

    await logActivity(
      user.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER,
    );

    return { success: 'Team member removed successfully' };
  },
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner']),
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;

    if (!user?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const existingMember = await db.teamMember.findFirst({
      where: {
        teamId:user.teamId,
        userId:user.id,
        
      },
      include: {
        user: true
      }
    });

    if (existingMember) {
      return { error: 'User is already a member of this team' };
    }

    // Check if there's an existing invitation
    const existingInvitation = await db.invitation.findFirst({
      where: {
        email: email,
        teamId: user.teamId,
        status: 'pending'
      }
    });

    if (existingInvitation) {
      return { error: 'An invitation has already been sent to this email' };
    }

    // Create a new invitation
    await db.invitation.create({
      data: {
        teamId: user.teamId,
        email,
        role,
        invitedById: user.id,
        status: 'pending'
      }
    });

    await logActivity(
      user.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER,
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: 'Invitation sent successfully' };
  },
);
