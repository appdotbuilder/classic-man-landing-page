
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput, type NewsletterSubscription } from '../schema';
import { eq } from 'drizzle-orm';

export const createNewsletterSubscription = async (input: CreateNewsletterSubscriptionInput): Promise<NewsletterSubscription> => {
  try {
    // Check if email already exists
    const existingSubscription = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, input.email))
      .limit(1)
      .execute();

    // If subscription exists and is active, return it
    if (existingSubscription.length > 0) {
      const existing = existingSubscription[0];
      if (existing.is_active) {
        return {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          subscribed_at: existing.subscribed_at,
          is_active: existing.is_active
        };
      } else {
        // Reactivate existing subscription with updated name
        const updated = await db.update(newsletterSubscriptionsTable)
          .set({
            name: input.name,
            is_active: true,
            subscribed_at: new Date()
          })
          .where(eq(newsletterSubscriptionsTable.id, existing.id))
          .returning()
          .execute();

        const updatedSubscription = updated[0];
        return {
          id: updatedSubscription.id,
          name: updatedSubscription.name,
          email: updatedSubscription.email,
          subscribed_at: updatedSubscription.subscribed_at,
          is_active: updatedSubscription.is_active
        };
      }
    }

    // Create new subscription
    const result = await db.insert(newsletterSubscriptionsTable)
      .values({
        name: input.name,
        email: input.email
      })
      .returning()
      .execute();

    const subscription = result[0];
    return {
      id: subscription.id,
      name: subscription.name,
      email: subscription.email,
      subscribed_at: subscription.subscribed_at,
      is_active: subscription.is_active
    };
  } catch (error) {
    console.error('Newsletter subscription creation failed:', error);
    throw error;
  }
};
