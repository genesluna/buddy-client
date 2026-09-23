'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/ssr';
import { AxiosError } from 'axios';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import {
  forgotPasswordSchema,
  ForgotPasswordData,
} from '../_config/forgot-password-schema';
import { useForgotPassword } from '../_hooks/use-forgot-password';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordData>({
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotMutate, isPending } = useForgotPassword({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          setApiError('Muitas tentativas. Por favor, aguarde um minuto antes de tentar novamente.');
        } else {
          setApiError('Não foi possível processar a solicitação. Tente novamente.');
        }
      } else {
        setApiError('Erro inesperado. Tente novamente mais tarde.');
      }
    },
  });

  function onSubmit(data: ForgotPasswordData) {
    setApiError(null);
    forgotMutate(data);
  }

  const emailRegister = register('email');

  if (isSuccess) {
    return (
      <div className='mt-8 flex w-full max-w-[467px] flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary text-accent'>
          <PaperPlaneTiltIcon size={32} />
        </div>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-accent'>Verifique seu email</h2>
          <p className='mt-2 text-sm text-content-300 leading-relaxed'>
            Se o endereço de email informado estiver cadastrado, enviamos as instruções e o link para você redefinir sua senha.
          </p>
        </div>
        <Button
          aria-label='Voltar ao login'
          type='button'
          label='Voltar ao login'
          className='w-full'
          onClick={() => router.push('/auth/login')}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-8'
    >
      <Input
        id='email'
        placeholder='Email cadastrado'
        type='email'
        autoComplete='email'
        className='w-full max-w-[467px]'
        icon={<EnvelopeIcon size={28} className='text-content-200/75' />}
        errorMessage={errors.email?.message}
        disabled={isPending}
        {...emailRegister}
        onChange={(e) => {
          if (apiError) setApiError(null);
          emailRegister.onChange(e);
        }}
      />

      {apiError && (
        <p className='text-center text-sm text-error' role='alert' aria-live='polite'>
          {apiError}
        </p>
      )}

      <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
        <Button
          aria-label='Enviar link de recuperação'
          type='submit'
          label='Enviar link'
          className='w-full xl:w-48'
          icon={<PaperPlaneTiltIcon size={24} />}
          isLoading={isPending}
          disabled={!isValid || isPending}
        />
        <Button
          aria-label='Voltar ao login'
          type='button'
          label='Voltar ao login'
          className='w-full xl:w-48'
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
