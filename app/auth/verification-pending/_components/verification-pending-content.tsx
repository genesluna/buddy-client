'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  CheckCircle,
  SignIn,
} from '@phosphor-icons/react';
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useResendVerification } from '../_hooks/use-resend-verification';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendSchema, ResendFormData } from '../_config/resend-schema';

export default function VerificationPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { mutate: resendEmail, isPending } = useResendVerification({
    onSuccess: () => {
      setFeedback({
        type: 'success',
        message: 'Email de verificação reenviado com sucesso!',
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setFeedback({
            type: 'error',
            message: 'Email não encontrado. Verifique se digitou corretamente.',
          });
        } else if (error.response?.status === 429) {
          setFeedback({
            type: 'error',
            message: 'Muitas tentativas. Aguarde antes de tentar novamente.',
          });
        } else {
          setFeedback({
            type: 'error',
            message: 'Erro ao reenviar email. Tente novamente.',
          });
        }
      } else {
        setFeedback({
          type: 'error',
          message: 'Erro ao reenviar email. Tente novamente.',
        });
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResendFormData>({
    mode: 'onBlur',
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  function handleResend(data: ResendFormData) {
    setFeedback(null);
    resendEmail({ email: data.email });
  }

  return (
    <div className='flex w-full max-w-[467px] flex-col items-center text-center'>
      <EnvelopeSimple size={64} className='mb-6 text-accent' weight='fill' />
      <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
        Verifique seu email
      </h1>
      <p className='mt-2 text-content-300'>
        Enviamos um link de verificação para o seu email. Clique no link para
        ativar sua conta.
      </p>
      <p className='mt-4 text-sm text-content-200'>
        Não recebeu o email? Verifique sua caixa de spam ou solicite um novo
        link abaixo.
      </p>

      <form
        noValidate
        onSubmit={handleSubmit(handleResend)}
        className='mt-8 flex w-full flex-col gap-4'
      >
        <Input
          id='email'
          placeholder='Seu email'
          type='email'
          autoComplete='email'
          className='w-full'
          icon={<EnvelopeSimple size={28} className='text-content-200/75' />}
          errorMessage={errors.email?.message}
          disabled={isPending}
          {...register('email')}
        />

        {feedback && (
          <div
            className={`flex items-center justify-center gap-2 text-sm ${
              feedback.type === 'success' ? 'text-success' : 'text-error'
            }`}
            role='alert'
            aria-live='polite'
          >
            {feedback.type === 'success' && <CheckCircle size={20} weight='fill' />}
            {feedback.message}
          </div>
        )}

        <Button
          type='submit'
          aria-label='Reenviar email de verificação'
          label='Reenviar email'
          className='w-full lg:w-72 lg:self-center'
          icon={<PaperPlaneTilt size={28} />}
          isLoading={isPending}
          disabled={!isValid || isPending}
        />
      </form>

      <Button
        type='button'
        aria-label='Ir para login'
        label='Ir para login'
        className='mt-4 w-full lg:w-72'
        outline
        icon={<SignIn size={28} />}
        onClick={() => router.push('/auth/login')}
      />
    </div>
  );
}
