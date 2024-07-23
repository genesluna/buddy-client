import { InputHTMLAttributes, ReactElement, forwardRef } from 'react';
import { IconProps } from '@phosphor-icons/react';
import { cn } from '@/app/_lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactElement<IconProps>;
  className?: string;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className, errorMessage, ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className='text-md mb-2 block text-black'>{label}</label>
        )}
        <div className='relative flex items-center'>
          <input
            {...props}
            ref={ref}
            className={cn(
              'text-content-20 h-14 w-full rounded-2xl border bg-content-600 py-3 pl-14 pr-4 text-lg focus:outline-none',
              {
                'border-error': errorMessage,
                'border-content-600 hover:border-accent focus:border-accent':
                  !errorMessage,
              }
            )}
          />

          <div className='absolute left-4'>{icon}</div>
        </div>
        <p
          className={cn('ms-3 mt-2 text-sm text-error', {
            flex: errorMessage,
            hidden: !errorMessage,
          })}
        >
          {errorMessage}
        </p>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
