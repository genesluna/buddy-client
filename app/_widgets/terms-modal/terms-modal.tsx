'use client';

import { useEffect } from 'react';
import { XIcon } from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import Button from '@/app/_components/ui/button';
import LoadingSpinner from '@/app/_components/loading-spinner';
import { fetchActiveTerms, TERMS_QUERY_KEYS } from '@/app/_entities/terms';

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
  isAccepting?: boolean;
}

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
  showAcceptButton = false,
  isAccepting = false,
}: TermsModalProps) {
  const { data: terms, isLoading, isError } = useQuery({
    queryKey: TERMS_QUERY_KEYS.active(),
    queryFn: fetchActiveTerms,
    enabled: isOpen,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-labelledby='terms-modal-title'
      onClick={onClose}
    >
      <div
        className='relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-8'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-terciary/50 pb-4'>
          <div>
            <h2
              id='terms-modal-title'
              className='text-xl font-bold text-accent sm:text-2xl'
            >
              Termos de Uso
            </h2>
            {terms?.versionTag && (
              <span className='text-xs font-semibold text-content-200'>
                Versão: {terms.versionTag}
              </span>
            )}
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Fechar modal de termos'
            className='rounded-full p-2 text-content-300 transition-colors hover:bg-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent'
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className='my-4 flex-1 overflow-y-auto pr-2 text-sm leading-relaxed text-content-300 sm:text-base'>
          {isLoading && (
            <div className='flex h-48 items-center justify-center'>
              <LoadingSpinner />
            </div>
          )}

          {isError && (
            <div className='flex h-48 flex-col items-center justify-center text-center'>
              <p className='text-error'>
                Não foi possível carregar os termos de uso no momento.
              </p>
              <p className='mt-1 text-xs text-content-200'>
                Por favor, tente novamente mais tarde.
              </p>
            </div>
          )}

          {terms && (
            <div className='prose prose-sm max-w-none whitespace-pre-wrap'>
              {terms.content}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className='flex flex-col-reverse justify-end gap-3 border-t border-terciary/50 pt-4 sm:flex-row'>
          <Button
            type='button'
            label='Fechar'
            outline
            onClick={onClose}
            className='w-full sm:w-32'
          />
          {showAcceptButton && onAccept && (
            <Button
              type='button'
              label='Aceitar e Continuar'
              onClick={onAccept}
              isLoading={isAccepting}
              disabled={isLoading || isError || isAccepting}
              className='w-full sm:w-auto'
            />
          )}
        </div>
      </div>
    </div>
  );
}
