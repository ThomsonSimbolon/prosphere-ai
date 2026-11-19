import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = true,
}) => {
  return (
    <div
      className={`bg-surface-container-low rounded-xl shadow-sm ${
        hoverable ? 'hover:bg-surface-container transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
