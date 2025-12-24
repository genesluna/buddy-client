import { ButtonHTMLAttributes, ReactElement } from 'react';
import { IconProps } from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/app/_lib/utils';

interface BaseButtonProps {
  outline?: boolean;
  className?: string;
  label?: string;
  icon?: ReactElement<IconProps>;
  isLoading?: boolean;
}

interface ButtonAsButton
  extends BaseButtonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps {
  href: string;
  onClick?: never;
  disabled?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Button component that renders as either a <button> or a Next.js <Link>.
 * Use `href` prop to render as a link with button styling.
 */
export default function Button({
  outline = false,
  className,
  label,
  icon,
  isLoading = false,
  href,
  ...props
}: ButtonProps) {
  const isDisabled = isLoading || (props as ButtonAsButton).disabled;

  const buttonClassName = cn(
    'text-md inline-flex h-[3.125rem] w-40 items-center justify-center gap-2 rounded-[1.25rem]',
    {
      'border border-accent bg-transparent text-accent duration-300 hover:border-none hover:bg-secondary hover:text-white':
        outline && !isDisabled,
      'bg-accent text-white duration-300 hover:bg-secondary': !outline && !isDisabled,
      'border border-accent bg-transparent text-accent': outline && isDisabled,
      'bg-accent text-white': !outline && isDisabled,
      'cursor-not-allowed opacity-70': isDisabled,
    },
    className
  );

  const content = isLoading ? (
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
  );

  // Render as Link when href is provided
  if (href) {
    // When loading, prevent navigation and indicate disabled state
    if (isLoading) {
      return (
        <span
          className={buttonClassName}
          aria-disabled="true"
          tabIndex={-1}
          role="link"
        >
          {content}
          {label}
        </span>
      );
    }

    return (
      <Link href={href} className={buttonClassName}>
        {content}
        {label}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={buttonClassName}
    >
      {content}
      {label}
    </button>
  );
}
