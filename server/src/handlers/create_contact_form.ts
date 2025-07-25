
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput, type ContactForm } from '../schema';

export const createContactForm = async (input: CreateContactFormInput): Promise<ContactForm> => {
  try {
    // Insert contact form submission record
    const result = await db.insert(contactFormsTable)
      .values({
        name: input.name,
        email: input.email,
        message: input.message
      })
      .returning()
      .execute();

    const contactForm = result[0];
    return {
      ...contactForm
    };
  } catch (error) {
    console.error('Contact form creation failed:', error);
    throw error;
  }
};
