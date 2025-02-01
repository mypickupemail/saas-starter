'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { TeamDataWithMembers } from '@/lib/db/schema';
import { removeTeamMember } from '@/app/(login)/actions';
import { InviteTeamMember } from './invite-team';
import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({ teamData }: { teamData: TeamDataWithMembers }) {
  const t = useTranslations('Dashboard.settings');
  const [_removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, { error: '', success: '' });

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">{t('title')}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('subscription.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">
                  {t('subscription.currentPlan')}: {teamData.planName || 'Free'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teamData.subscriptionStatus === 'active'
                    ? t('subscription.billedMonthly')
                    : teamData.subscriptionStatus === 'trialing'
                      ? t('subscription.trialPeriod')
                      : t('subscription.noSubscription')}
                </p>
              </div>
              <form action={customerPortalAction}>
                <Button type="submit" variant="outline">
                  {t('subscription.manageButton')}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('teamMembers.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {teamData.members.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={getUserDisplayName(member.user)}
                    />
                    <AvatarFallback>
                      {getUserDisplayName(member.user)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {getUserDisplayName(member.user)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {t('teamMembers.role')}
                    </p>
                  </div>
                </div>
                {index > 1 ? (
                  <form action={removeAction}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isRemovePending}
                    >
                      {isRemovePending ? t('teamMembers.removingButton') : t('teamMembers.removeButton')}
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
          <InviteTeamMember  />
        </CardContent>
      </Card>
    </section>
  );
}
