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
  primary: "bg-sodium text-asphalt hover:bg-[#f7b55a]",
  secondary: "border border-white/20 bg-white/5 text-mist backdrop-blur-md hover:border-white/45 hover:bg-white/10",
  ghost: "text-fog hover:text-mist",
};

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";

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
