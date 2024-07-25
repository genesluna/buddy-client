import HorizontalLayout from '@/app/_components/horizontal-layout';
import LoginForm from '@/app/auth/login/_components/login-form';

export default function LoginPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Bem-vindo</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>Acesse a sua conta</p>
      <LoginForm />
    </HorizontalLayout>
  );
}
