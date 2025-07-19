
import { db } from '../db';
import { enrollmentInterestsTable } from '../db/schema';
import { type EnrollmentInterest } from '../schema';
import { desc } from 'drizzle-orm';

export async function getEnrollmentInterests(): Promise<EnrollmentInterest[]> {
  try {
    const results = await db.select()
      .from(enrollmentInterestsTable)
      .orderBy(desc(enrollmentInterestsTable.interested_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch enrollment interests:', error);
    throw error;
  }
}
