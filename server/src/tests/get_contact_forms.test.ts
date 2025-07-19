
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { getContactForms } from '../handlers/get_contact_forms';

describe('getContactForms', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no contact forms exist', async () => {
    const result = await getContactForms();
    
    expect(result).toEqual([]);
  });

  it('should return all contact forms ordered by newest first', async () => {
    // Create test contact forms with different timestamps
    const form1 = await db.insert(contactFormsTable)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'First inquiry',
        is_read: false
      })
      .returning()
      .execute();

    // Create second form slightly later
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const form2 = await db.insert(contactFormsTable)
      .values({
        name: 'Jane Smith',
        email: 'jane@example.com', 
        message: 'Second inquiry',
        is_read: true
      })
      .returning()
      .execute();

    const result = await getContactForms();

    expect(result).toHaveLength(2);
    
    // Should be ordered by newest first (form2 then form1)
    expect(result[0].name).toEqual('Jane Smith');
    expect(result[0].email).toEqual('jane@example.com');
    expect(result[0].message).toEqual('Second inquiry');
    expect(result[0].is_read).toBe(true);
    expect(result[0].id).toBeDefined();
    expect(result[0].submitted_at).toBeInstanceOf(Date);
    
    expect(result[1].name).toEqual('John Doe');
    expect(result[1].email).toEqual('john@example.com');
    expect(result[1].message).toEqual('First inquiry');
    expect(result[1].is_read).toBe(false);
    expect(result[1].id).toBeDefined();
    expect(result[1].submitted_at).toBeInstanceOf(Date);
    
    // Verify ordering - newer form should have later timestamp
    expect(result[0].submitted_at.getTime()).toBeGreaterThan(result[1].submitted_at.getTime());
  });

  it('should include all required fields', async () => {
    await db.insert(contactFormsTable)
      .values({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message content',
        is_read: false
      })
      .execute();

    const result = await getContactForms();

    expect(result).toHaveLength(1);
    const form = result[0];
    
    expect(form.id).toBeDefined();
    expect(typeof form.id).toBe('number');
    expect(form.name).toEqual('Test User');
    expect(form.email).toEqual('test@example.com');
    expect(form.message).toEqual('Test message content');
    expect(form.is_read).toBe(false);
    expect(form.submitted_at).toBeInstanceOf(Date);
  });

  it('should handle forms with different read status', async () => {
    // Create unread form
    await db.insert(contactFormsTable)
      .values({
        name: 'Unread User',
        email: 'unread@example.com',
        message: 'Unread message',
        is_read: false
      })
      .execute();

    // Create read form  
    await db.insert(contactFormsTable)
      .values({
        name: 'Read User',
        email: 'read@example.com',
        message: 'Read message',
        is_read: true
      })
      .execute();

    const result = await getContactForms();

    expect(result).toHaveLength(2);
    
    // Find each form by email
    const unreadForm = result.find(f => f.email === 'unread@example.com');
    const readForm = result.find(f => f.email === 'read@example.com');
    
    expect(unreadForm).toBeDefined();
    expect(unreadForm!.is_read).toBe(false);
    
    expect(readForm).toBeDefined();
    expect(readForm!.is_read).toBe(true);
  });
});
