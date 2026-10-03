'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyIcon, LockSimpleIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from '../_config/reset-password-schema';
import { useResetPassword } from '../_hooks/use-reset-password';

interface ResetPasswordFormProps {
  initialToken?: string;
}

export default function ResetPasswordForm({ initialToken = '' }: ResetPasswordFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: initialToken,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: resetMutate, isPending } = useResetPassword({
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso! Acesse sua conta.');
      router.push('/auth/login');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 422) {
          setApiError('Token inválido ou expirado. Solicite uma nova recuperação de senha.');
        } else if (error.response?.status === 429) {
          setApiError('Muitas tentativas. Aguarde um momento antes de tentar novamente.');
        } else {
          setApiError('Erro ao redefinir a senha. Tente novamente.');
        }
      } else {
        setApiError('Erro ao redefinir a senha. Tente novamente.');
      }
    },
  });

  function onSubmit(data: ResetPasswordFormData) {
    setApiError(null);
    resetMutate({
      token: data.token,
      newPassword: data.newPassword,
    });
  }

  const tokenRegister = register('token');
  const passwordRegister = register('newPassword');
  const confirmPasswordRegister = register('confirmPassword');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-8 flex w-full max-w-[467px] flex-col gap-4 lg:gap-6'
    >
      {!initialToken && (
        <Input
          id='token'
          placeholder='Código ou Token de redefinição'
          type='text'
          className='w-full max-w-[467px]'
          icon={<KeyIcon size={28} className='text-content-200/75' />}
          errorMessage={errors.token?.message}
          disabled={isPending}
          {...tokenRegister}
          onChange={(e) => {
            if (apiError) setApiError(null);
            tokenRegister.onChange(e);
          }}
        />
      )}

      <Input
        id='newPassword'
        placeholder='Nova senha'
        type='password'
        autoComplete='new-password'
        className='w-full max-w-[467px]'
        icon={<LockSimpleIcon size={28} className='text-content-200/75' />}
        errorMessage={errors.newPassword?.message}
        disabled={isPending}
        {...passwordRegister}
        onChange={(e) => {
          if (apiError) setApiError(null);
          passwordRegister.onChange(e);
        }}
      />

      <Input
        id='confirmPassword'
        placeholder='Confirme a nova senha'
        type='password'
        autoComplete='new-password'
        className='w-full max-w-[467px]'
        icon={<LockSimpleIcon size={28} className='text-content-200/75' />}
        errorMessage={errors.confirmPassword?.message}
        disabled={isPending}
        {...confirmPasswordRegister}
        onChange={(e) => {
          if (apiError) setApiError(null);
          confirmPasswordRegister.onChange(e);
        }}
      />

      {apiError && (
        <p className='text-center text-sm text-error' role='alert' aria-live='polite'>
          {apiError}
        </p>
      )}

      <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
        <Button
          aria-label='Redefinir senha'
          type='submit'
          label='Redefinir senha'
          className='w-full xl:w-48'
          icon={<CheckCircleIcon size={24} />}
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
