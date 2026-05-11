import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 border-1.5 bg-transparent font-sans text-[13px] placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors resize-vertical ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
