import { string, z } from 'zod';

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;

export const resetPasswordSchema = z
  .object({
    token: string().min(1, 'Token de redefinição é obrigatório'),
    newPassword: string()
      .min(6, 'A nova senha deve ter entre 6 e 16 caracteres')
      .max(16, 'A nova senha deve ter entre 6 e 16 caracteres')
      .regex(
        STRONG_PASSWORD_REGEX,
        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
      ),
    confirmPassword: string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
