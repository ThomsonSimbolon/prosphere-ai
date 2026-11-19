import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'pulse' | 'active' | 'plain' | 'paid' | 'mono';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'plain',
  className = '',
}) => {
  switch (variant) {
    case 'pulse':
      return (
        <span
          className={`font-label-sm text-label-sm bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {label}
        </span>
      );

    case 'active':
      return (
        <span
          className={`font-label-sm text-label-sm bg-secondary/10 text-secondary font-semibold px-2 py-0.5 rounded-full ${className}`}
        >
          {label}
        </span>
      );

    case 'paid':
      return (
        <span
          className={`font-label-sm text-label-sm bg-secondary/15 text-secondary font-semibold px-2 py-0.5 rounded-full ${className}`}
        >
          {label}
        </span>
      );

    case 'mono':
      return (
        <span
          className={`font-label-sm text-label-sm text-on-surface-variant/60 font-mono ${className}`}
        >
          {label}
        </span>
      );

    case 'plain':
    default:
      return (
        <span
          className={`font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-medium px-2 py-0.5 rounded-full ${className}`}
        >
          {label}
        </span>
      );
  }
};
