import RegisterForm from '@/app/auth/register/_components/register-form';
import HorizontalLayout from '@/app/_components/horizontal-layout';

export default function RegisterPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-4xl font-bold text-accent'>Bem-vindo</h1>
      <p className='mt-2 text-lg text-content-300'>
        Crie sua conta de novo abrigo
      </p>
      <RegisterForm />
    </HorizontalLayout>
  );
}
