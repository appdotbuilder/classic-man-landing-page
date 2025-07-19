
import { serial, text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core';

// Newsletter subscriptions table
export const newsletterSubscriptionsTable = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  subscribed_at: timestamp('subscribed_at').defaultNow().notNull(),
  is_active: boolean('is_active').default(true).notNull()
});

// Contact form submissions table
export const contactFormsTable = pgTable('contact_forms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  is_read: boolean('is_read').default(false).notNull()
});

// Course enrollment interest table
export const enrollmentInterestsTable = pgTable('enrollment_interests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'), // Nullable field
  interested_at: timestamp('interested_at').defaultNow().notNull(),
  is_contacted: boolean('is_contacted').default(false).notNull()
});

// TypeScript types for the table schemas
export type NewsletterSubscription = typeof newsletterSubscriptionsTable.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptionsTable.$inferInsert;

export type ContactForm = typeof contactFormsTable.$inferSelect;
export type NewContactForm = typeof contactFormsTable.$inferInsert;

export type EnrollmentInterest = typeof enrollmentInterestsTable.$inferSelect;
export type NewEnrollmentInterest = typeof enrollmentInterestsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  newsletterSubscriptions: newsletterSubscriptionsTable,
  contactForms: contactFormsTable,
  enrollmentInterests: enrollmentInterestsTable
};
