'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import db from '@/lib/db';

export const checkoutAction = withTeam(async (formData, team) => {
  const planIdFromForm = formData.get('priceId') as string;

  if (!planIdFromForm) {
    // This should ideally be handled with a more user-friendly error on the client-side
    // or a redirect back with an error message.
    throw new Error('Plan ID is missing.');
  }

  const subscriptionPlan = await db.subscriptionPlan.findUnique({
    where: { id: planIdFromForm },
  });

  if (!subscriptionPlan) {
    throw new Error('Selected subscription plan not found.');
  }

  // Assuming you want to use the monthly price ID for now.
  // If you have yearly options, you'll need logic to determine which price ID to use.
  const stripePriceId = subscriptionPlan.stripeMonthlyPriceId;

  if (!stripePriceId) {
    throw new Error('Stripe Price ID not configured for this plan.');
  }

  // The createCheckoutSession function expects the actual Stripe Price ID.
  await createCheckoutSession({ team: team, priceId: stripePriceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
