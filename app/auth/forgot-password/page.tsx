import { HorizontalLayout } from '@/app/_widgets/layouts';
import ForgotPasswordForm from './_components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Recuperar Senha</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>
        Informe seu email para receber o link de redefinição
      </p>
      <ForgotPasswordForm />
    </HorizontalLayout>
  );
}
