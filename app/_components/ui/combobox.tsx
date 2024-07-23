'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/app/_lib/utils';

interface ComboboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  placeHolder: string;
  options: string[];
  className?: string;
  placeholderClassName?: string;
  errorMessage?: string;
}

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      id,
      label,
      placeHolder,
      placeholderClassName,
      options,
      className,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');

    options = ['Todos', ...options];

    function handleSelectOption(option: string) {
      if (option !== selectedOption) {
        if (option === 'Todos') {
          setSelectedOption('');
          option = '';
        }

        setSelectedOption(option);
        triggerInput(id, option);
      }
      setIsOpen(false);
    }

    function triggerInput(enteredName: string, enteredValue: string) {
      const input = document.getElementById(enteredName);
      const event = new Event('input', { bubbles: true });
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      nativeInputValueSetter?.call(input, enteredValue);
      input?.dispatchEvent(event);
    }

    return (
      <label className={cn('relative w-full', className)}>
        {label && (
          <span className='ms-2 text-sm text-content-200'>{label}</span>
        )}
        <input
          id={id}
          {...props}
          ref={ref}
          type='text'
          className='hidden'
          onClick={() => setIsOpen(!isOpen)}
        />

        <div
          className={cn(
            'text-md flex cursor-pointer items-center justify-between rounded-2xl border bg-content-600 px-5 py-3 text-content-200',
            {
              'border-error': errorMessage,
              'border-content-600 hover:border-accent focus:border-accent':
                !errorMessage,
            }
          )}
        >
          <span className={placeholderClassName}>
            {selectedOption || placeHolder}
          </span>
          <CaretDown
            size={20}
            className={cn({
              'rotate-180 transition-transform': isOpen,
              'rotate-360 transition-transform': !isOpen,
            })}
          />
        </div>

        <div
          className={cn(
            'absolute z-10 mt-2 w-full rounded-2xl border border-accent bg-white',
            {
              flex: isOpen,
              hidden: !isOpen,
            }
          )}
        >
          <div className='text-md flex w-full flex-col gap-1 p-4'>
            {options?.map((option, index) => (
              <div className='' key={index}>
                <input
                  type='button'
                  value={option}
                  className='w-full cursor-pointer rounded-xl bg-transparent p-2 text-left text-content-200 duration-300 hover:bg-secondary hover:text-white'
                  onClick={() => {
                    handleSelectOption(option);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <span
          className={cn('ms-3 mt-2 text-sm text-error', {
            flex: errorMessage,
            hidden: !errorMessage,
          })}
        >
          {errorMessage}
        </span>
      </label>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;
