import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const colorVariants = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  accent: 'bg-accent-100 text-accent-700',
  warm: 'bg-warm-200 text-warm-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof colorVariants;
  className?: string;
}

export default function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
