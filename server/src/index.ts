
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas and handlers
import {
  createNewsletterSubscriptionInputSchema,
  createContactFormInputSchema,
  createEnrollmentInterestInputSchema
} from './schema';

import { createNewsletterSubscription } from './handlers/create_newsletter_subscription';
import { createContactForm } from './handlers/create_contact_form';
import { createEnrollmentInterest } from './handlers/create_enrollment_interest';
import { getNewsletterSubscriptions } from './handlers/get_newsletter_subscriptions';
import { getContactForms } from './handlers/get_contact_forms';
import { getEnrollmentInterests } from './handlers/get_enrollment_interests';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Newsletter subscription endpoints
  createNewsletterSubscription: publicProcedure
    .input(createNewsletterSubscriptionInputSchema)
    .mutation(({ input }) => createNewsletterSubscription(input)),
  
  getNewsletterSubscriptions: publicProcedure
    .query(() => getNewsletterSubscriptions()),

  // Contact form endpoints
  createContactForm: publicProcedure
    .input(createContactFormInputSchema)
    .mutation(({ input }) => createContactForm(input)),
  
  getContactForms: publicProcedure
    .query(() => getContactForms()),

  // Enrollment interest endpoints
  createEnrollmentInterest: publicProcedure
    .input(createEnrollmentInterestInputSchema)
    .mutation(({ input }) => createEnrollmentInterest(input)),
  
  getEnrollmentInterests: publicProcedure
    .query(() => getEnrollmentInterests()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
        credentials: true,
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`Classic Man Course API server listening at port: ${port}`);
}

start();
