import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'line' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'line',
}) => {
  const baseClasses =
    'animate-pulse bg-surface-container-high/60 rounded-lg relative overflow-hidden';

  if (variant === 'circle') {
    return <div className={`rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div
        className={`bg-surface-container-low border border-outline-variant/20 rounded-2xl p-space-md ${baseClasses} ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container" />
          <div className="w-16 h-5 rounded-full bg-surface-container" />
        </div>
        <div className="w-24 h-4 bg-surface-container rounded mb-2" />
        <div className="w-36 h-8 bg-surface-container rounded" />
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} />;
};
