import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

type LinkButtonProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-ink text-white hover:bg-black",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:bg-white/70",
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  className = "",
  variant = "primary",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
