
import { z } from 'zod';

// Newsletter/Contact form schema
export const newsletterSubscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subscribed_at: z.coerce.date(),
  is_active: z.boolean()
});

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;

// Input schema for newsletter subscription
export const createNewsletterSubscriptionInputSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ser válido')
});

export type CreateNewsletterSubscriptionInput = z.infer<typeof createNewsletterSubscriptionInputSchema>;

// Contact form schema for general inquiries
export const contactFormSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  submitted_at: z.coerce.date(),
  is_read: z.boolean()
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Input schema for contact form submission
export const createContactFormInputSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ser válido'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
});

export type CreateContactFormInput = z.infer<typeof createContactFormInputSchema>;

// Course enrollment interest schema
export const enrollmentInterestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  interested_at: z.coerce.date(),
  is_contacted: z.boolean()
});

export type EnrollmentInterest = z.infer<typeof enrollmentInterestSchema>;

// Input schema for enrollment interest
export const createEnrollmentInterestInputSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ser válido'),
  phone: z.string().optional()
});

export type CreateEnrollmentInterestInput = z.infer<typeof createEnrollmentInterestInputSchema>;
