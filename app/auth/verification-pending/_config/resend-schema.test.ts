import { resendSchema } from './resend-schema';

describe('resendSchema', () => {
  it('validates correct email', () => {
    const result = resendSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = resendSchema.safeParse({ email: 'invalid-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
      expect(result.error.issues[0].message).toBe('Insira um email válido');
    }
  });

  it('rejects empty email', () => {
    const result = resendSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = resendSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
