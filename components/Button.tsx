import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'soft';
}

export default function Button({ href, children, variant = 'primary' }: ButtonProps) {
  const variantClass = variant === 'soft' ? 'jawa-button-soft' : 'jawa-button-primary';

  return (
    <Link
      href={href}
      className={`jawa-button ${variantClass} block text-center active:scale-[0.98] transition`}
    >
      {children}
    </Link>
  );
}
