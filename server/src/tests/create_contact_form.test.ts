
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput } from '../schema';
import { createContactForm } from '../handlers/create_contact_form';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactFormInput = {
  name: 'João Silva',
  email: 'joao@example.com',
  message: 'Gostaria de saber mais informações sobre os cursos disponíveis.'
};

describe('createContactForm', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact form submission', async () => {
    const result = await createContactForm(testInput);

    // Basic field validation
    expect(result.name).toEqual('João Silva');
    expect(result.email).toEqual('joao@example.com');
    expect(result.message).toEqual(testInput.message);
    expect(result.id).toBeDefined();
    expect(result.submitted_at).toBeInstanceOf(Date);
    expect(result.is_read).toBe(false); // Should default to false
  });

  it('should save contact form to database', async () => {
    const result = await createContactForm(testInput);

    // Query using proper drizzle syntax
    const contactForms = await db.select()
      .from(contactFormsTable)
      .where(eq(contactFormsTable.id, result.id))
      .execute();

    expect(contactForms).toHaveLength(1);
    expect(contactForms[0].name).toEqual('João Silva');
    expect(contactForms[0].email).toEqual('joao@example.com');
    expect(contactForms[0].message).toEqual(testInput.message);
    expect(contactForms[0].submitted_at).toBeInstanceOf(Date);
    expect(contactForms[0].is_read).toBe(false);
  });

  it('should handle long messages correctly', async () => {
    const longMessageInput: CreateContactFormInput = {
      name: 'Maria Santos',
      email: 'maria@example.com',
      message: 'Esta é uma mensagem muito longa para testar se o sistema consegue lidar com mensagens extensas. Estou interessada em saber mais sobre os cursos oferecidos, especialmente aqueles relacionados à tecnologia e programação. Gostaria de entender melhor a estrutura dos cursos, duração, metodologia de ensino e possibilidades de certificação.'
    };

    const result = await createContactForm(longMessageInput);

    expect(result.name).toEqual('Maria Santos');
    expect(result.email).toEqual('maria@example.com');
    expect(result.message).toEqual(longMessageInput.message);
    expect(result.message.length).toBeGreaterThan(10); // Satisfies minimum length requirement
  });

  it('should set correct default values', async () => {
    const result = await createContactForm(testInput);

    // Verify default values are applied correctly
    expect(result.is_read).toBe(false);
    expect(result.submitted_at).toBeInstanceOf(Date);
    
    // Verify the timestamp is recent (within last minute)
    const now = new Date();
    const timeDiff = now.getTime() - result.submitted_at.getTime();
    expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
  });
});
