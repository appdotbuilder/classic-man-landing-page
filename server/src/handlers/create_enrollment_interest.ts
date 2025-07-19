
import { db } from '../db';
import { enrollmentInterestsTable } from '../db/schema';
import { type CreateEnrollmentInterestInput, type EnrollmentInterest } from '../schema';

export const createEnrollmentInterest = async (input: CreateEnrollmentInterestInput): Promise<EnrollmentInterest> => {
  try {
    // Insert enrollment interest record
    const result = await db.insert(enrollmentInterestsTable)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone || null // Handle optional phone field
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Enrollment interest creation failed:', error);
    throw error;
  }
};
