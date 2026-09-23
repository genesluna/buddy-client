import { forgotPasswordSchema } from './forgot-password-schema';

describe('forgotPasswordSchema', () => {
  it('validates a correct email format', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@buddy.com' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email format', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'invalid-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Insira um email válido');
    }
  });

  it('rejects an empty email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });
});
