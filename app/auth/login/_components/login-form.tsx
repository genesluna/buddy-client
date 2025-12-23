'use client';

import {
  EnvelopeIcon,
  LockSimpleIcon,
  SignInIcon,
} from '@phosphor-icons/react/dist/ssr';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useLogin } from '../_hooks/use-login';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { string, z } from 'zod';
import { useState } from 'react';

const loginSchema = z.object({
  email: string().email('Insira um email válido'),
  password: string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: () => {
      router.push('/');
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        setApiError('Email ou senha inválidos');
      } else if (error.response?.status === 429) {
        setApiError('Muitas tentativas. Aguarde antes de tentar novamente.');
      } else {
        setApiError('Erro ao fazer login. Tente novamente.');
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginData>({
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(loginSchema),
  });

  function handleLogin(data: LoginData) {
    setApiError(null);
    loginMutate(data);
  }

  function clearApiError() {
    if (apiError) {
      setApiError(null);
    }
  }

  const emailRegister = register('email');
  const passwordRegister = register('password');

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='email'
        placeholder='Email'
        type='email'
        autoComplete='email'
        className='w-full max-w-[467px]'
        icon={<EnvelopeIcon size={28} className='text-content-200/75' />}
        errorMessage={errors.email?.message}
        disabled={isPending}
        {...emailRegister}
        onChange={(e) => {
          clearApiError();
          emailRegister.onChange(e);
        }}
      />
      <Input
        id='password'
        placeholder='Senha'
        type='password'
        autoComplete='current-password'
        className='w-full max-w-[467px]'
        icon={<LockSimpleIcon size={28} className='text-content-200/75' />}
        errorMessage={errors.password?.message}
        disabled={isPending}
        {...passwordRegister}
        onChange={(e) => {
          clearApiError();
          passwordRegister.onChange(e);
        }}
      />

      {apiError && (
        <p className='text-center text-sm text-error' role='alert' aria-live='polite'>
          {apiError}
        </p>
      )}

      <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
        <Button
          aria-label='Entrar'
          type='submit'
          label='Entrar'
          className='w-full xl:w-40'
          icon={<SignInIcon size={28} />}
          isLoading={isPending}
          disabled={!isValid || isPending}
        />
        <Button
          aria-label='Resetar a senha'
          type='button'
          label='Resetar a senha'
          className='w-full xl:w-72'
          outline
          disabled={isPending}
          onClick={() => {
            if (!isPending) {
              router.push('/auth/reset-password');
            }
          }}
        />
      </div>
      <Button
        aria-label='Registrar novo abrigo'
        type='button'
        label='Registrar novo abrigo'
        className='mb-10 w-full lg:mb-auto xl:w-72'
        outline
        disabled={isPending}
        onClick={() => {
          if (!isPending) {
            router.push('/auth/register');
          }
        }}
      />
    </form>
  );
}
