import { registerSchema } from './register-schema';

describe('registerSchema', () => {
  const validData = {
    email: 'test@example.com',
    phoneNumber: '11999999999',
    password: 'password123',
    confirmPassword: 'password123',
    termsOfUseAndPrivacyConsent: true,
  };

  function expectValidationError(
    data: Partial<typeof validData>,
    field: string,
    expectedMessage: string
  ) {
    const result = registerSchema.safeParse({ ...validData, ...data });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain(field);
      expect(result.error.issues[0].message).toBe(expectedMessage);
    }
  }

  function expectValidationSuccess(data: Partial<typeof validData>) {
    const result = registerSchema.safeParse({ ...validData, ...data });
    expect(result.success).toBe(true);
  }

  it('validates correct data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('email validation', () => {
    it('rejects invalid email', () => {
      expectValidationError({ email: 'invalid-email' }, 'email', 'Insira um email válido');
    });

    it('rejects empty email', () => {
      const result = registerSchema.safeParse({ ...validData, email: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('phoneNumber validation', () => {
    it('accepts 4-digit phone number', () => {
      expectValidationSuccess({ phoneNumber: '1234' });
    });

    it('accepts 20-digit phone number', () => {
      expectValidationSuccess({ phoneNumber: '12345678901234567890' });
    });

    it('rejects phone number with less than 4 digits', () => {
      expectValidationError(
        { phoneNumber: '123' },
        'phoneNumber',
        'O telefone deve ter pelo menos 4 dígitos'
      );
    });

    it('rejects phone number with more than 20 digits', () => {
      expectValidationError(
        { phoneNumber: '123456789012345678901' },
        'phoneNumber',
        'O telefone deve ter no máximo 20 dígitos'
      );
    });

    it('rejects phone number with non-numeric characters', () => {
      expectValidationError(
        { phoneNumber: '1199-9999-999' },
        'phoneNumber',
        'O telefone deve conter apenas números'
      );
    });

    it('rejects phone number with letters', () => {
      const result = registerSchema.safeParse({ ...validData, phoneNumber: '11999abc999' });
      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    it('accepts 6-character password', () => {
      expectValidationSuccess({ password: '123456', confirmPassword: '123456' });
    });

    it('accepts 16-character password', () => {
      expectValidationSuccess({ password: '1234567890123456', confirmPassword: '1234567890123456' });
    });

    it('rejects password with less than 6 characters', () => {
      expectValidationError(
        { password: '12345', confirmPassword: '12345' },
        'password',
        'A senha deve ter pelo menos 6 caracteres'
      );
    });

    it('rejects password with more than 16 characters', () => {
      expectValidationError(
        { password: '12345678901234567', confirmPassword: '12345678901234567' },
        'password',
        'A senha deve ter no máximo 16 caracteres'
      );
    });
  });

  describe('confirmPassword validation', () => {
    it('rejects when passwords do not match', () => {
      expectValidationError(
        { password: 'password123', confirmPassword: 'password456' },
        'confirmPassword',
        'As senhas devem ser iguais'
      );
    });
  });

  describe('termsOfUseAndPrivacyConsent validation', () => {
    it('rejects when terms are not accepted', () => {
      expectValidationError(
        { termsOfUseAndPrivacyConsent: false },
        'termsOfUseAndPrivacyConsent',
        'Você deve aceitar os termos de uso'
      );
    });
  });
});
