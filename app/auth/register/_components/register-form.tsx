'use client';

import {
  Envelope,
  LockSimple,
  Phone,
  UserPlus,
} from '@phosphor-icons/react/dist/ssr';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useRegister } from '../_hooks/use-register';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import {
  registerSchema,
  RegisterFormData,
} from '../_config/register-schema';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate: registerMutate, isPending } = useRegister({
    onSuccess: (data) => {
      const encodedEmail = encodeURIComponent(data.email);
      router.push(`/auth/verification-pending?email=${encodedEmail}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setApiError('Este email já está cadastrado');
        } else if (error.response?.status === 400) {
          setApiError('Dados inválidos. Verifique os campos.');
        } else if (error.response?.status === 429) {
          setApiError('Muitas tentativas. Aguarde antes de tentar novamente.');
        } else {
          setApiError('Erro ao criar conta. Tente novamente.');
        }
      } else {
        setApiError('Erro ao criar conta. Tente novamente.');
      }
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsOfUserConsent: false,
    },
  });

  function handleRegister(data: RegisterFormData) {
    setApiError(null);
    registerMutate({
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      termsOfUserConsent: data.termsOfUserConsent,
    });
  }

  function clearApiError() {
    if (apiError) {
      setApiError(null);
    }
  }

  const emailRegister = register('email');
  const phoneRegister = register('phoneNumber');
  const passwordRegister = register('password');
  const confirmPasswordRegister = register('confirmPassword');

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleRegister)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='email'
        placeholder='Email'
        type='email'
        autoComplete='email'
        className='w-full max-w-[467px]'
        icon={<Envelope size={28} className='text-content-200/75' />}
        errorMessage={errors.email?.message}
        disabled={isPending}
        {...emailRegister}
        onChange={(e) => {
          clearApiError();
          emailRegister.onChange(e);
        }}
      />
      <Input
        id='phone-number'
        placeholder='Telefone (apenas números)'
        type='tel'
        autoComplete='tel'
        className='w-full max-w-[467px]'
        icon={<Phone size={28} className='text-content-200/75' />}
        errorMessage={errors.phoneNumber?.message}
        disabled={isPending}
        {...phoneRegister}
        onChange={(e) => {
          clearApiError();
          phoneRegister.onChange(e);
        }}
      />
      <Input
        id='password'
        placeholder='Senha (6-16 caracteres)'
        type='password'
        autoComplete='new-password'
        className='w-full max-w-[467px]'
        icon={<LockSimple size={28} className='text-content-200/75' />}
        errorMessage={errors.password?.message}
        disabled={isPending}
        {...passwordRegister}
        onChange={(e) => {
          clearApiError();
          passwordRegister.onChange(e);
        }}
      />
      <Input
        id='confirm-password'
        placeholder='Confirme a senha'
        type='password'
        autoComplete='new-password'
        className='w-full max-w-[467px]'
        icon={<LockSimple size={28} className='text-content-200/75' />}
        errorMessage={errors.confirmPassword?.message}
        disabled={isPending}
        {...confirmPasswordRegister}
        onChange={(e) => {
          clearApiError();
          confirmPasswordRegister.onChange(e);
        }}
      />

      <div className='flex flex-col gap-2'>
        <div className='flex items-start gap-3'>
          <Controller
            name='termsOfUserConsent'
            control={control}
            render={({ field }) => (
              <input
                type='checkbox'
                id='terms'
                checked={field.value}
                onChange={(e) => {
                  clearApiError();
                  field.onChange(e.target.checked);
                }}
                disabled={isPending}
                className='mt-1 h-5 w-5 cursor-pointer rounded border-content-200 accent-accent'
              />
            )}
          />
          <label htmlFor='terms' className='cursor-pointer text-sm text-content-300'>
            Li e aceito os{' '}
            <Link
              href='/terms-of-service'
              className='text-accent underline hover:text-secondary'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
            >
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link
              href='/privacy-policy'
              className='text-accent underline hover:text-secondary'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
            >
              Política de Privacidade
            </Link>
          </label>
        </div>
        {errors.termsOfUserConsent && (
          <p className='ms-3 text-sm text-error'>
            {errors.termsOfUserConsent.message}
          </p>
        )}
      </div>

      {apiError && (
        <p className='text-center text-sm text-error' role='alert' aria-live='polite'>
          {apiError}
        </p>
      )}

      <div className='flex flex-col items-center justify-center gap-4'>
        <Button
          type='submit'
          aria-label='Criar conta'
          label='Criar conta'
          className='w-full lg:w-72'
          icon={<UserPlus size={28} />}
          isLoading={isPending}
          disabled={!isValid || isPending}
        />
        <Button
          type='button'
          aria-label='Já tenho uma conta'
          label='Já tenho uma conta'
          className='mb-10 w-full lg:mb-auto lg:w-72'
          outline
          disabled={isPending}
          onClick={() => {
            if (!isPending) {
              router.push('/auth/login');
            }
          }}
        />
      </div>
    </form>
  );
}
