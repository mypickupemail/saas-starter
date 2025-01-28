import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { auth } from '@/lib/auth/config';
import db from '@/lib/db';

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user
  if (!user) {
    redirect('/sign-in');
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

  return <Settings teamData={team} />;
}
