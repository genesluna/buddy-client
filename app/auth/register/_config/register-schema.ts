import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Insira um email válido'),
    phoneNumber: z
      .string()
      .min(4, 'O telefone deve ter pelo menos 4 dígitos')
      .max(20, 'O telefone deve ter no máximo 20 dígitos')
      .regex(/^\d+$/, 'O telefone deve conter apenas números'),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .max(16, 'A senha deve ter no máximo 16 caracteres'),
    confirmPassword: z.string(),
    termsOfUserConsent: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Você deve aceitar os termos de uso',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
