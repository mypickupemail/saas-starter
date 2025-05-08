import { hashPassword } from '@/lib/auth/password_utils';
import { stripe } from '@/lib/payments/stripe';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
 
async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data:{
      email: email,
      passwordHash: passwordHash,
      role: "OWNER",
    }
  }) 

  console.log('Initial user created.');
  const team = await prisma.team.create({
    data:{
      name:"Test Team"
    }
  }) 
  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: user.id,
      role: 'OWNER',
    }
  })
 

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });