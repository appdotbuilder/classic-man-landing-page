
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { getNewsletterSubscriptions } from '../handlers/get_newsletter_subscriptions';

describe('getNewsletterSubscriptions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no subscriptions exist', async () => {
    const result = await getNewsletterSubscriptions();

    expect(result).toEqual([]);
  });

  it('should return only active newsletter subscriptions', async () => {
    // Create test subscriptions - both active and inactive
    await db.insert(newsletterSubscriptionsTable)
      .values([
        {
          name: 'Active User 1',
          email: 'active1@example.com',
          is_active: true
        },
        {
          name: 'Inactive User',
          email: 'inactive@example.com',
          is_active: false
        },
        {
          name: 'Active User 2',
          email: 'active2@example.com',
          is_active: true
        }
      ])
      .execute();

    const result = await getNewsletterSubscriptions();

    expect(result).toHaveLength(2);
    expect(result.every(sub => sub.is_active)).toBe(true);
    
    // Check that we have the right users without assuming order
    const userNames = result.map(sub => sub.name).sort();
    expect(userNames).toEqual(['Active User 1', 'Active User 2']);
  });

  it('should return subscriptions ordered by subscribed_at descending', async () => {
    // Create subscriptions with explicit different timestamps
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Insert one by one to ensure different timestamps
    await db.insert(newsletterSubscriptionsTable)
      .values({
        name: 'Oldest User',
        email: 'oldest@example.com',
        is_active: true,
        subscribed_at: twoDaysAgo
      })
      .execute();

    await db.insert(newsletterSubscriptionsTable)
      .values({
        name: 'Middle User',
        email: 'middle@example.com',
        is_active: true,
        subscribed_at: yesterday
      })
      .execute();

    await db.insert(newsletterSubscriptionsTable)
      .values({
        name: 'Newest User',
        email: 'newest@example.com',
        is_active: true,
        subscribed_at: now
      })
      .execute();

    const result = await getNewsletterSubscriptions();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('Newest User');
    expect(result[1].name).toEqual('Middle User');
    expect(result[2].name).toEqual('Oldest User');
    
    // Verify dates are properly ordered
    expect(result[0].subscribed_at >= result[1].subscribed_at).toBe(true);
    expect(result[1].subscribed_at >= result[2].subscribed_at).toBe(true);
  });

  it('should return all required fields for newsletter subscriptions', async () => {
    await db.insert(newsletterSubscriptionsTable)
      .values({
        name: 'Test User',
        email: 'test@example.com',
        is_active: true
      })
      .execute();

    const result = await getNewsletterSubscriptions();

    expect(result).toHaveLength(1);
    const subscription = result[0];
    
    expect(subscription.id).toBeDefined();
    expect(subscription.name).toEqual('Test User');
    expect(subscription.email).toEqual('test@example.com');
    expect(subscription.subscribed_at).toBeInstanceOf(Date);
    expect(subscription.is_active).toBe(true);
  });
});
