import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  tailwindButtonVariants,
  type TailwindButtonVariant,
} from "./tailwindButtonVariants";

export type TailwindButtonProps = {
  variant: TailwindButtonVariant;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export const TailwindButton = forwardRef<HTMLButtonElement, TailwindButtonProps>(
  function TailwindButton(
    {
      variant,
      children,
      className,
      type = "button",
      disabled,
      ...rest
    },
    ref,
  ) {
    const variantClass = tailwindButtonVariants[variant];
    const classes = className
      ? `${variantClass} ${className}`
      : variantClass;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${classes}${disabled ? " cursor-not-allowed opacity-60" : ""}`}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export type { TailwindButtonVariant };
export { tailwindButtonVariants, tailwindButtonShowcase } from "./tailwindButtonVariants";