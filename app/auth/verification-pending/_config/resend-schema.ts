import { z } from 'zod';

export const resendSchema = z.object({
  email: z.string().email('Insira um email válido'),
});

export type ResendFormData = z.infer<typeof resendSchema>;
