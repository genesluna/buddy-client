'use client';

import { Envelope, LockSimple, SignIn } from '@phosphor-icons/react/dist/ssr';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/input';
import { string, z } from 'zod';
import Link from 'next/link';

const loginSchema = z.object({
  email: string().email('Insira um email válido'),
  password: string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<LoginData>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(loginSchema),
  });

  type LoginData = z.infer<typeof loginSchema>;

  function handleLogin(data: LoginData) {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='email'
        placeholder='Email'
        type='email'
        className='w-full max-w-[467px]'
        icon={<Envelope size={28} className='text-content-200/75' />}
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <Input
        id='password'
        placeholder='Senha'
        type='password'
        className='w-full max-w-[467px]'
        icon={<LockSimple size={28} className='text-content-200/75' />}
        errorMessage={errors.password?.message}
        {...register('password')}
      />

      <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
        <Button
          type='submit'
          label='Entrar'
          className='w-full xl:w-40'
          icon={<SignIn size={28} />}
          isLoading={isLoading}
          disabled={!isValid}
        />
        <Button label='Resetar a senha' className='w-full xl:w-72' outline />
      </div>
      <Link href='/auth/register'>
        <Button
          label='Registrar novo abrigo'
          className='mb-10 w-full lg:mb-auto xl:w-72'
          outline
        />
      </Link>
    </form>
  );
}
