import RegisterForm from '@/app/auth/register/_components/register-form';
import { HorizontalLayout } from '@/app/_widgets/layouts';

export default function RegisterPage() {
  return (
    <HorizontalLayout>
      <h1 className='text-3xl font-bold text-accent sm:text-4xl'>Criar conta</h1>
      <p className='mt-2 text-content-300 sm:text-lg'>
        Cadastre-se para adotar pets ou gerenciar seu abrigo
      </p>
      <RegisterForm />
    </HorizontalLayout>
  );
}
