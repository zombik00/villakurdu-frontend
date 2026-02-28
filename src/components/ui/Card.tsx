import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverLift?: boolean;
}

export default function Card({ children, hoverLift = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card',
        hoverLift && 'hover-lift',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
