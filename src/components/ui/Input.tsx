import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-[48px] px-4 border-1.5 bg-transparent font-sans text-[13px] placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
