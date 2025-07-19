
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { enrollmentInterestsTable } from '../db/schema';
import { type CreateEnrollmentInterestInput } from '../schema';
import { createEnrollmentInterest } from '../handlers/create_enrollment_interest';
import { eq } from 'drizzle-orm';

// Test input with phone number
const testInputWithPhone: CreateEnrollmentInterestInput = {
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '+55 11 99999-9999'
};

// Test input without phone number
const testInputWithoutPhone: CreateEnrollmentInterestInput = {
  name: 'Maria Santos',
  email: 'maria@example.com'
};

describe('createEnrollmentInterest', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create enrollment interest with phone', async () => {
    const result = await createEnrollmentInterest(testInputWithPhone);

    // Basic field validation
    expect(result.name).toEqual('João Silva');
    expect(result.email).toEqual('joao@example.com');
    expect(result.phone).toEqual('+55 11 99999-9999');
    expect(result.id).toBeDefined();
    expect(result.interested_at).toBeInstanceOf(Date);
    expect(result.is_contacted).toBe(false);
  });

  it('should create enrollment interest without phone', async () => {
    const result = await createEnrollmentInterest(testInputWithoutPhone);

    // Basic field validation
    expect(result.name).toEqual('Maria Santos');
    expect(result.email).toEqual('maria@example.com');
    expect(result.phone).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.interested_at).toBeInstanceOf(Date);
    expect(result.is_contacted).toBe(false);
  });

  it('should save enrollment interest to database', async () => {
    const result = await createEnrollmentInterest(testInputWithPhone);

    // Query using proper drizzle syntax
    const interests = await db.select()
      .from(enrollmentInterestsTable)
      .where(eq(enrollmentInterestsTable.id, result.id))
      .execute();

    expect(interests).toHaveLength(1);
    expect(interests[0].name).toEqual('João Silva');
    expect(interests[0].email).toEqual('joao@example.com');
    expect(interests[0].phone).toEqual('+55 11 99999-9999');
    expect(interests[0].interested_at).toBeInstanceOf(Date);
    expect(interests[0].is_contacted).toBe(false);
  });

  it('should handle null phone in database', async () => {
    const result = await createEnrollmentInterest(testInputWithoutPhone);

    // Query database to verify null phone is stored correctly
    const interests = await db.select()
      .from(enrollmentInterestsTable)
      .where(eq(enrollmentInterestsTable.id, result.id))
      .execute();

    expect(interests).toHaveLength(1);
    expect(interests[0].phone).toBeNull();
  });
});
