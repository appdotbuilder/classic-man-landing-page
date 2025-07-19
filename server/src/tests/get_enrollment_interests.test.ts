
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { enrollmentInterestsTable } from '../db/schema';
import { type CreateEnrollmentInterestInput } from '../schema';
import { getEnrollmentInterests } from '../handlers/get_enrollment_interests';
import { eq } from 'drizzle-orm';

describe('getEnrollmentInterests', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no enrollment interests exist', async () => {
    const results = await getEnrollmentInterests();
    
    expect(results).toEqual([]);
  });

  it('should return all enrollment interests ordered by interested_at desc', async () => {
    // Create test data with different timestamps
    const firstInterest: CreateEnrollmentInterestInput = {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999'
    };

    const secondInterest: CreateEnrollmentInterestInput = {
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '11888888888'
    };

    const thirdInterest: CreateEnrollmentInterestInput = {
      name: 'Pedro Costa',
      email: 'pedro@email.com'
    };

    // Insert records with slight delays to ensure different timestamps
    await db.insert(enrollmentInterestsTable)
      .values({
        name: firstInterest.name,
        email: firstInterest.email,
        phone: firstInterest.phone
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(enrollmentInterestsTable)
      .values({
        name: secondInterest.name,
        email: secondInterest.email,
        phone: secondInterest.phone
      })
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(enrollmentInterestsTable)
      .values({
        name: thirdInterest.name,
        email: thirdInterest.email,
        phone: thirdInterest.phone || null
      })
      .execute();

    const results = await getEnrollmentInterests();

    // Should return 3 records
    expect(results).toHaveLength(3);

    // Should be ordered by interested_at DESC (newest first)
    expect(results[0].interested_at >= results[1].interested_at).toBe(true);
    expect(results[1].interested_at >= results[2].interested_at).toBe(true);

    // Verify all fields are present
    results.forEach(interest => {
      expect(interest.id).toBeDefined();
      expect(interest.name).toBeDefined();
      expect(interest.email).toBeDefined();
      expect(interest.interested_at).toBeInstanceOf(Date);
      expect(typeof interest.is_contacted).toBe('boolean');
      // phone can be null so we just check it's defined
      expect(interest.phone !== undefined).toBe(true);
    });

    // Verify specific data
    const names = results.map(r => r.name);
    expect(names).toContain('João Silva');
    expect(names).toContain('Maria Santos');
    expect(names).toContain('Pedro Costa');
  });

  it('should include is_contacted status for lead tracking', async () => {
    // Create one interest and manually update is_contacted status
    await db.insert(enrollmentInterestsTable)
      .values({
        name: 'Ana Oliveira',
        email: 'ana@email.com',
        phone: '11777777777'
      })
      .execute();

    // Update is_contacted to true for one record
    await db.update(enrollmentInterestsTable)
      .set({ is_contacted: true })
      .where(eq(enrollmentInterestsTable.email, 'ana@email.com'))
      .execute();

    const results = await getEnrollmentInterests();

    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual('Ana Oliveira');
    expect(results[0].email).toEqual('ana@email.com');
    expect(results[0].phone).toEqual('11777777777');
    expect(results[0].is_contacted).toBe(true);
  });

  it('should handle records with and without phone numbers', async () => {
    // Create interest with phone
    await db.insert(enrollmentInterestsTable)
      .values({
        name: 'Carlos Lima',
        email: 'carlos@email.com',
        phone: '11666666666'
      })
      .execute();

    // Create interest without phone
    await db.insert(enrollmentInterestsTable)
      .values({
        name: 'Lucia Ferreira',
        email: 'lucia@email.com',
        phone: null
      })
      .execute();

    const results = await getEnrollmentInterests();

    expect(results).toHaveLength(2);

    // Find each record and verify phone handling
    const carlosRecord = results.find(r => r.name === 'Carlos Lima');
    const luciaRecord = results.find(r => r.name === 'Lucia Ferreira');

    expect(carlosRecord?.phone).toEqual('11666666666');
    expect(luciaRecord?.phone).toBeNull();
  });
});
