'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { inviteTeamMember } from '@/app/(login)/actions';
import { useUser } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { Role } from "@prisma/client";

type ActionState = {
  error?: string;
  success?: string;
};

export function InviteTeamMember() {
  const { user } = useUser();
  const t = useTranslations('Dashboard.inviteTeam');
  const isOwner = user?.activeTeamRole === Role.OWNER;
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, { error: '', success: '' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('email.label')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('email.placeholder')}
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>{t('role.label')}</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">{t('role.member')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">{t('role.owner')}</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-red-500">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('button.inviting')}
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('button.invite')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {t('permissions.ownerOnly')}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
