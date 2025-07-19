
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type NewsletterSubscription } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getNewsletterSubscriptions = async (): Promise<NewsletterSubscription[]> => {
  try {
    // Query active newsletter subscriptions ordered by subscription date (newest first)
    const results = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.is_active, true))
      .orderBy(desc(newsletterSubscriptionsTable.subscribed_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch newsletter subscriptions:', error);
    throw error;
  }
};
