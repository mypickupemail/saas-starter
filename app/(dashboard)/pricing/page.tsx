import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import db from '@/lib/db';
import { SubscriptionPlan, PlanFeature, Feature } from '@prisma/client';
import { SubmitButton } from './submit-button';

// Prices are fresh for one hour max
export const revalidate = 3600;

// Define a type for the plan with its features
type PlanWithFeatures = SubscriptionPlan & {
  planFeatures: (PlanFeature & {
    feature: Feature;
  })[];
};

export default async function PricingPage() {
  // Fetch active and public subscription plans from the database
  const plans: PlanWithFeatures[] = await db.subscriptionPlan.findMany({
    where: {
      isActive: true,
      isPublic: true,
    },
    include: {
      planFeatures: {
        where: {
          enabled: true,
        },
        include: {
          feature: true,
        },
        orderBy: {
          // If you add an order field to PlanFeature, you can use it here
          // feature: { displayOrder: 'asc' } // Assuming Feature has displayOrder
        }
      },
    },
    orderBy: {
      displayOrder: 'asc', // Assuming SubscriptionPlan has displayOrder
    },
  });

  if (!plans.length) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">No pricing plans available at the moment. Please check back later.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Adjust grid columns based on number of plans, or use a responsive grid */}
      <div className={`grid md:grid-cols-${plans.length > 1 ? plans.length : 1} gap-8 max-w-xl mx-auto md:max-w-none`}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.displayName}
            // Convert price from dollars (float) to cents (integer)
            // Provide a default of 0 if monthlyPrice is null
            price={plan.monthlyPrice ? Math.round(plan.monthlyPrice * 100) : 0}
            interval={'month'} // Assuming monthly interval
            trialDays={plan.trialDays || 0} // Default to 0 if null
            features={plan.planFeatures.map(pf => pf.feature.displayName || pf.feature.description || pf.feature.key)}
            // Pass the SubscriptionPlan.id. checkoutAction will need to handle this.
            priceId={plan.id}
          />
        ))}
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string;
  price: number; // Expecting price in cents
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string; // This is now SubscriptionPlan.id
}) {
  return (
    <div className="pt-6 border rounded-lg p-6 shadow-lg flex flex-col">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      {trialDays > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          with {trialDays} day free trial
        </p>
      )}
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      {priceId ? (
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-auto">Contact us for this plan.</p>
      )}
    </div>
  );
}
