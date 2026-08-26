import { resetPasswordSchema } from './reset-password-schema';

describe('resetPasswordSchema', () => {
  const validData = {
    token: 'valid-reset-token-123',
    newPassword: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
  };

  it('validates correct password and matching confirmation', () => {
    const result = resetPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects missing token', () => {
    const result = resetPasswordSchema.safeParse({ ...validData, token: '' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      newPassword: 'Ab1!',
      confirmPassword: 'Ab1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without special character or digit', () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      newPassword: 'SimplePassword',
      confirmPassword: 'SimplePassword',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched confirmPassword', () => {
    const result = resetPasswordSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPassword123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('As senhas não coincidem');
    }
  });
});
