import { cn } from '@/lib/utils';
import { IconProps } from '@phosphor-icons/react';
import { ButtonHTMLAttributes, ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outline?: boolean;
  className?: string;
  label?: string;
  icon?: ReactElement<IconProps>;
  isLoading?: boolean;
}

export default function Button({
  outline = false,
  className,
  label,
  icon,
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'text-md inline-flex h-[3.125rem] w-40 items-center justify-center gap-2 rounded-[1.25rem] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-accent',
        {
          'border border-accent bg-transparent text-accent duration-300 hover:border-none hover:bg-secondary hover:text-white':
            outline,
          'bg-accent text-white duration-300 hover:bg-secondary': !outline,
        },
        className
      )}
    >
      {isLoading ? (
        <div
          className={cn(
            'text-surface inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
            {
              'text-accent': outline,
              'text-white': !outline,
            }
          )}
          role='status'
        >
          <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
            Loading...
          </span>
        </div>
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
