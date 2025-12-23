'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, SignIn } from '@phosphor-icons/react';
import Button from '@/app/_components/ui/button';
import { useConfirmEmail } from '../_hooks/use-confirm-email';
import { AxiosError } from 'axios';

type VerificationStatus = 'loading' | 'success' | 'error';

const TOKEN_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_TOKEN_LENGTH = 512;

function isValidTokenFormat(token: string): boolean {
  return token.length > 0 && token.length <= MAX_TOKEN_LENGTH && TOKEN_PATTERN.test(token);
}

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const hasAttemptedRef = useRef(false);

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { mutate: confirmEmail } = useConfirmEmail({
    onSuccess: () => {
      setStatus('success');
    },
    onError: (error) => {
      setStatus('error');
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setErrorMessage('Token inválido ou expirado.');
        } else if (error.response?.status === 404) {
          setErrorMessage('Verificação não encontrada.');
        } else {
          setErrorMessage('Erro ao verificar email. Tente novamente.');
        }
      } else {
        setErrorMessage('Erro ao verificar email. Tente novamente.');
      }
    },
  });

  useEffect(() => {
    if (hasAttemptedRef.current) {
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMessage('Token de verificação não encontrado.');
      return;
    }

    if (!isValidTokenFormat(token)) {
      setStatus('error');
      setErrorMessage('Formato de token inválido.');
      return;
    }

    hasAttemptedRef.current = true;
    confirmEmail({ token });
  }, [token, confirmEmail]);

  return (
    <div className='flex w-full max-w-[467px] flex-col items-center text-center'>
      {status === 'loading' && (
        <>
          <div
            className='mb-6 h-16 w-16 animate-spin rounded-full border-4 border-solid border-accent border-e-transparent'
            role='status'
          >
            <span className='sr-only'>Verificando...</span>
          </div>
          <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
            Verificando seu email...
          </h1>
          <p className='mt-2 text-content-300'>
            Aguarde enquanto confirmamos seu email.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={64} className='mb-6 text-success' weight='fill' />
          <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
            Email verificado!
          </h1>
          <p className='mt-2 text-content-300'>
            Sua conta foi verificada com sucesso. Você já pode fazer login.
          </p>
          <Button
            type='button'
            aria-label='Ir para login'
            label='Ir para login'
            className='mt-8 w-full lg:w-72'
            icon={<SignIn size={28} />}
            onClick={() => router.push('/auth/login')}
          />
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={64} className='mb-6 text-error' weight='fill' />
          <h1 className='text-2xl font-bold text-accent sm:text-3xl'>
            Erro na verificação
          </h1>
          <p className='mt-2 text-content-300'>{errorMessage}</p>
          <Button
            type='button'
            aria-label='Ir para login'
            label='Ir para login'
            className='mt-8 w-full lg:w-72'
            icon={<SignIn size={28} />}
            onClick={() => router.push('/auth/login')}
          />
        </>
      )}
    </div>
  );
}
