import RegisterForm from '@/app/auth/register/_components/register-form';
import HorizontalLayout from '@/app/_components/horizontal-layout';

export default function RegisterPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Bem-vindo</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>
        Crie sua conta de novo abrigo
      </p>
      <RegisterForm />
    </HorizontalLayout>
  );
}
