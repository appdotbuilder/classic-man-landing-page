
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput } from '../schema';
import { createNewsletterSubscription } from '../handlers/create_newsletter_subscription';
import { eq } from 'drizzle-orm';

// Test input data
const testInput: CreateNewsletterSubscriptionInput = {
  name: 'João Silva',
  email: 'joao@example.com'
};

describe('createNewsletterSubscription', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a new newsletter subscription', async () => {
    const result = await createNewsletterSubscription(testInput);

    // Validate returned data
    expect(result.name).toEqual('João Silva');
    expect(result.email).toEqual('joao@example.com');
    expect(result.is_active).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.subscribed_at).toBeInstanceOf(Date);
  });

  it('should save subscription to database', async () => {
    const result = await createNewsletterSubscription(testInput);

    // Verify data was persisted
    const subscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, result.id))
      .execute();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].name).toEqual('João Silva');
    expect(subscriptions[0].email).toEqual('joao@example.com');
    expect(subscriptions[0].is_active).toBe(true);
    expect(subscriptions[0].subscribed_at).toBeInstanceOf(Date);
  });

  it('should return existing active subscription for duplicate email', async () => {
    // Create first subscription
    const first = await createNewsletterSubscription(testInput);
    
    // Try to create duplicate with same email
    const duplicateInput: CreateNewsletterSubscriptionInput = {
      name: 'João Santos', // Different name
      email: 'joao@example.com' // Same email
    };
    
    const second = await createNewsletterSubscription(duplicateInput);

    // Should return the original subscription
    expect(second.id).toEqual(first.id);
    expect(second.name).toEqual('João Silva'); // Original name preserved
    expect(second.email).toEqual('joao@example.com');
    expect(second.is_active).toBe(true);

    // Verify only one record exists in database
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, 'joao@example.com'))
      .execute();

    expect(allSubscriptions).toHaveLength(1);
  });

  it('should reactivate inactive subscription with updated name', async () => {
    // Create initial subscription
    const initial = await createNewsletterSubscription(testInput);

    // Manually deactivate it
    await db.update(newsletterSubscriptionsTable)
      .set({ is_active: false })
      .where(eq(newsletterSubscriptionsTable.id, initial.id))
      .execute();

    // Try to subscribe again with updated name
    const resubscribeInput: CreateNewsletterSubscriptionInput = {
      name: 'João Santos Updated',
      email: 'joao@example.com'
    };

    const result = await createNewsletterSubscription(resubscribeInput);

    // Should reactivate and update name
    expect(result.id).toEqual(initial.id);
    expect(result.name).toEqual('João Santos Updated');
    expect(result.email).toEqual('joao@example.com');
    expect(result.is_active).toBe(true);
    expect(result.subscribed_at).toBeInstanceOf(Date);

    // Verify database was updated
    const updated = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, initial.id))
      .execute();

    expect(updated[0].name).toEqual('João Santos Updated');
    expect(updated[0].is_active).toBe(true);
  });

  it('should handle different email addresses correctly', async () => {
    // Create first subscription
    await createNewsletterSubscription(testInput);

    // Create second subscription with different email
    const differentEmailInput: CreateNewsletterSubscriptionInput = {
      name: 'Maria Silva',
      email: 'maria@example.com'
    };

    const result = await createNewsletterSubscription(differentEmailInput);

    expect(result.name).toEqual('Maria Silva');
    expect(result.email).toEqual('maria@example.com');
    expect(result.is_active).toBe(true);

    // Verify both subscriptions exist
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .execute();

    expect(allSubscriptions).toHaveLength(2);
  });
});
