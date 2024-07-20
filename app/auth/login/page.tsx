import HorizontalLayout from '@/components/layouts/horizontal-layout';
import LoginForm from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-4xl font-bold text-accent'>Bem-vindo</h1>
      <p className='mt-2 text-lg text-content-300'>Acesse a sua conta</p>
      <LoginForm />
    </HorizontalLayout>
  );
}
