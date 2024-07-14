import { cn } from "@lib/utils";
import { IconProps } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, ReactElement } from "react";

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
      className = {
        cn('inline-flex gap-2 text-md items-center justify-center w-40 h-[3.125rem] rounded-[1.25rem] disabled:opacity-70 \
         disabled:cursor-not-allowed disabled:hover:bg-accent',
         {
          "border border-accent bg-transparent text-accent hover:bg-secondary hover:text-white hover:border-none duration-300": outline,
          "bg-accent text-white hover:bg-secondary duration-300": !outline
         }, 
         className
        )}
    >
      {isLoading ? (
        <div
          className={
            cn('inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current \
             border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]', 
             {
              "text-accent": outline,
              "text-white": !outline
             }
            )}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
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
