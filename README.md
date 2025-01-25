
# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

**Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Stripe Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Stripe Customer Portal
- Authentication with Next-auth (Email/Password + OAuth providers)
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Next-auth](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

1. Copy the environment variables template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your:
   - Database connection string
   - Next-auth configuration (NEXTAUTH_SECRET, optional OAuth providers)
   - Stripe keys

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Seed the database with a default user and team:
```bash
npx prisma db seed
```

This will create:
- User: `test@test.com`
- Password: `admin123`

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

For Stripe webhooks during development:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Authentication Configuration

The template comes pre-configured with:
- Email/password authentication
- Session management with JWT
- Protected API routes using Next-auth middleware

To enable OAuth providers:
1. Add your credentials to `.env`
```env
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```
2. Update `src/auth/options.ts` to include the providers

## Testing Payments

Use Stripe test card:
- **Card**: `4242 4242 4242 4242`
- **Date**: Any future date
- **CVC**: Any 3 digits

## Production Deployment

### Vercel Deployment
1. Push your code to a Git repository
2. Connect to Vercel and deploy
3. Add environment variables in Vercel settings:
```env
DATABASE_URL=your_production_db_url
AUTH_SECRET=your_random_secret  # generate with: openssl rand -base64 32
AUTH_URL=https://yourdomain.com
STRIPE_SECRET_KEY=your_live_key
```

### Database Setup
Create a production PostgreSQL database and connect it through Prisma:
```bash
npx prisma migrate deploy
```

### Stripe Webhooks
1. Create production webhook in Stripe Dashboard
2. Set endpoint to: `https://yourdomain.com/api/stripe/webhook`
3. Add webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## Key Changes from Original
- Replaced Drizzle ORM with Prisma migrations and schema
- Switched custom JWT auth to Next-auth implementation
- Updated database seed script to use Prisma client
- Added Next-auth middleware for route protection
- Simplified session management with built-in Next-auth methods
 


 ## WIP
 - [ ] update user context-> next-auth