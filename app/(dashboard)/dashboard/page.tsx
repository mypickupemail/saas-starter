import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { auth } from '@/lib/auth/config';
import db from '@/lib/db';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const t = await getTranslations('Dashboard.settings');
  const session = await auth();
  const user = session?.user
  if (!user) {
    redirect('/sign-in');
  }

  if (!user?.teamId) {
    throw new Error(t('errors.noTeam'));
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
    throw new Error(t('errors.teamNotFound'));
  }

  return <Settings teamData={team} />;
}
