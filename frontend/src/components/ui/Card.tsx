// ============================================================
// PORTGUARD AI — CARD COMPONENT
// ============================================================

import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'kpi';
  children: ReactNode;
  padding?: boolean;
}

export default function Card({
  variant = 'default',
  children,
  padding = true,
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={`card card--${variant} ${padding ? 'card--padded' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
